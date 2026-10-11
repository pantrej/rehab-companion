// Case-study board workspace: a separate, development-only Excalidraw editor for the board in
// case-study/boards. Run with `npm run board`. Not part of the Rehab Companion app or its build.
import { normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import {
  BoardConflictError,
  BoardValidationError,
  boardFile,
  boardLabel,
  readBoard,
  writeBoard,
} from './case-study/mcp/board-store.ts'

const PORT = Number(process.env.BOARD_PORT) || 4174
const samePath = (a: string, b: string) => normalize(a).toLowerCase() === normalize(b).toLowerCase()

// GET  /api/case-study/board  → { hash, path, document } read from disk
// POST /api/case-study/board  ← { baseHash, document, force? } written back to the same file.
//   Goes through the shared board store (also used by the MCP server): the document is validated,
//   writers are locked against each other, and a save based on an older version is refused with 409
//   (plus the file's current contents) unless force is set.
// The file is watched; changes from anyone else (MCP, Claude, an editor) reach the page as
// `board:external-change`.
function boardApi(): Plugin {
  let lastWrittenHash = ''

  return {
    name: 'case-study-board-api',
    apply: 'serve',
    configureServer(server) {
      const send = (res: import('node:http').ServerResponse, status: number, body: unknown) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(body))
      }

      server.middlewares.use('/api/case-study/board', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const { hash, document } = await readBoard()
            return send(res, 200, { hash, path: boardLabel, document })
          }
          if (req.method === 'POST') {
            let body = ''
            for await (const chunk of req) body += chunk
            const { baseHash, document, force } = JSON.parse(body)
            lastWrittenHash = await writeBoard(document, force ? undefined : baseHash)
            return send(res, 200, { hash: lastWrittenHash })
          }
          send(res, 405, { error: 'Use GET or POST' })
        } catch (err) {
          if (err instanceof BoardConflictError) {
            const { hash, document } = await readBoard()
            return send(res, 409, { error: 'The file changed on disk', hash, document })
          }
          if (err instanceof BoardValidationError) return send(res, 400, { error: err.message, problems: err.problems })
          send(res, 500, { error: (err as Error).message })
        }
      })

      server.watcher.add(boardFile)
      server.watcher.on('change', async (file) => {
        if (!samePath(file, boardFile)) return
        try {
          const { hash } = await readBoard()
          if (hash === lastWrittenHash) return // our own save
          server.ws.send({ type: 'custom', event: 'board:external-change', data: { hash } })
        } catch {
          // Mid-write by another tool; the next change event carries the finished file.
        }
      })

      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          server.config.logger.info(`\n  Case-study board: http://localhost:${PORT}/\n  Editing: ${boardLabel}\n`)
        }, 100)
      })
    },
  }
}

export default defineConfig({
  root: fileURLToPath(new URL('./case-study/workspace', import.meta.url)),
  plugins: [react(), boardApi()],
  server: { port: PORT, strictPort: true },
})
