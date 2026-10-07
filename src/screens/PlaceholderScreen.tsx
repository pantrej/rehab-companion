// Stand-in for tabs that are not designed yet, so the navigation stays clickable.
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),3rem)]">
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">{title}</h1>
      <p className="mt-2 text-[15px] text-ink-soft">This screen hasn't been designed yet.</p>
    </div>
  )
}
