export type MovementId = 'knee-extension' | 'calf-raise' | 'squat' | 'hip-abduction'

// One drawing per movement in today's session. Line art on purpose: it shows which part moves and which
// way, it does not stand in for a clinician's recording. The vocabulary is the same in all four — the
// body as plain segments, the furniture a shade lighter, the joints marked, and a dashed arc where the
// moving part travels — so four exercises read as one set rather than four illustrations.
const body = 'stroke-[#cfc8bc]'
const furniture = 'fill-[#dcd6cb]'

type Props = { movement: MovementId; playing: boolean; label: string }

export function MovementIllustration({ movement, playing, label }: Props) {
  const Drawing = drawings[movement]
  return (
    <svg viewBox="0 0 320 240" className="size-full" role="img" aria-label={label}>
      <line x1="14" y1="196" x2="300" y2="196" className="stroke-ink-faint/30" strokeWidth={2} strokeLinecap="round" />
      <Drawing playing={playing} />
    </svg>
  )
}

// The travel of the moving part, left in place as the movement repeats.
function Path({ d }: { d: string }) {
  return (
    <path d={d} fill="none" className="stroke-accent/35" strokeWidth={2} strokeDasharray="3 6" strokeLinecap="round" />
  )
}

function Joint({ cx, cy, strong = false }: { cx: number; cy: number; strong?: boolean }) {
  return <circle cx={cx} cy={cy} r={6} className={strong ? 'fill-accent/70' : 'fill-accent/55'} />
}

// A chair seen from the side: the seat the person sits on, and the leg under it.
function Chair() {
  return (
    <>
      <rect x="14" y="52" width="86" height="16" rx="8" className={furniture} />
      <rect x="20" y="68" width="10" height="126" rx="5" className={furniture} />
    </>
  )
}

const motion = (playing: boolean, name: string) => (playing ? name : '')

// Seated, the lower leg swinging up from the knee until it is level, then lowering under control.
function KneeExtension({ playing }: { playing: boolean }) {
  return (
    <>
      <Chair />
      <Path d="M206 186 C 232 176, 248 150, 252 120" />
      <line x1="62" y1="58" x2="172" y2="62" className={body} strokeWidth={26} strokeLinecap="round" />
      <g
        className={motion(playing, 'animate-knee-extend')}
        style={{ transformOrigin: '172px 62px', transformBox: 'view-box' }}
      >
        <line x1="172" y1="62" x2="196" y2="186" className={body} strokeWidth={21} strokeLinecap="round" />
        <line x1="186" y1="190" x2="232" y2="182" className={body} strokeWidth={15} strokeLinecap="round" />
        <Joint cx={196} cy={180} strong />
      </g>
      <Joint cx={172} cy={62} />
    </>
  )
}

// Seated, the heel lifting off the floor while the foot pivots on its ball. Three parts move together:
// the thigh hinges at the hip, the shin rises with the knee, and the foot pivots, which lifts the heel.
function CalfRaise({ playing }: { playing: boolean }) {
  return (
    <>
      <Chair />
      <Path d="M158 190 C 160 182, 164 176, 170 172" />
      <g
        className={motion(playing, 'animate-thigh-lift')}
        style={{ transformOrigin: '62px 58px', transformBox: 'view-box' }}
      >
        <line x1="62" y1="58" x2="172" y2="62" className={body} strokeWidth={26} strokeLinecap="round" />
      </g>
      <g className={motion(playing, 'animate-shin-lift')} style={{ transformBox: 'view-box' }}>
        <line x1="172" y1="62" x2="196" y2="186" className={body} strokeWidth={21} strokeLinecap="round" />
        <Joint cx={172} cy={62} />
        <Joint cx={196} cy={180} strong />
      </g>
      <g
        className={motion(playing, 'animate-heel-raise')}
        style={{ transformOrigin: '208px 192px', transformBox: 'view-box' }}
      >
        <line x1="160" y1="190" x2="236" y2="190" className={body} strokeWidth={15} strokeLinecap="round" />
      </g>
    </>
  )
}

// Standing behind the chair, hands resting on its back, the hips travelling back and down and pressing up.
// The shin stays where it is and the thigh folds at the knee, which is what makes it read as a squat
// rather than a bow.
function Squat({ playing }: { playing: boolean }) {
  return (
    <>
      <rect x="24" y="58" width="92" height="14" rx="7" className={furniture} />
      <rect x="52" y="72" width="10" height="122" rx="5" className={furniture} />
      <Path d="M186 126 C 180 136, 170 142, 158 146" />
      <line x1="180" y1="152" x2="178" y2="190" className={body} strokeWidth={20} strokeLinecap="round" />
      <line x1="156" y1="192" x2="212" y2="192" className={body} strokeWidth={14} strokeLinecap="round" />
      <g
        className={motion(playing, 'animate-squat-thigh')}
        style={{ transformOrigin: '180px 152px', transformBox: 'view-box' }}
      >
        <line x1="174" y1="116" x2="180" y2="152" className={body} strokeWidth={24} strokeLinecap="round" />
        <Joint cx={174} cy={116} />
      </g>
      <g className={motion(playing, 'animate-squat-lower')} style={{ transformBox: 'view-box' }}>
        <line x1="170" y1="62" x2="174" y2="116" className={body} strokeWidth={26} strokeLinecap="round" />
        <line x1="166" y1="68" x2="96" y2="66" className={body} strokeWidth={12} strokeLinecap="round" />
      </g>
      <Joint cx={180} cy={152} strong />
    </>
  )
}

// Standing, seen from the front, one leg lifting out to the side and lowering with control.
function HipAbduction({ playing }: { playing: boolean }) {
  return (
    <>
      <rect x="18" y="58" width="78" height="14" rx="7" className={furniture} />
      <rect x="40" y="72" width="10" height="122" rx="5" className={furniture} />
      <Path d="M214 190 C 234 184, 248 170, 254 152" />
      <line x1="146" y1="50" x2="146" y2="112" className={body} strokeWidth={26} strokeLinecap="round" />
      <line x1="142" y1="58" x2="76" y2="66" className={body} strokeWidth={12} strokeLinecap="round" />
      <line x1="136" y1="116" x2="134" y2="188" className={body} strokeWidth={20} strokeLinecap="round" />
      <line x1="120" y1="192" x2="150" y2="192" className={body} strokeWidth={13} strokeLinecap="round" />
      <g
        className={motion(playing, 'animate-hip-abduct')}
        style={{ transformOrigin: '158px 114px', transformBox: 'view-box' }}
      >
        <line x1="160" y1="118" x2="164" y2="188" className={body} strokeWidth={20} strokeLinecap="round" />
        <line x1="150" y1="192" x2="180" y2="192" className={body} strokeWidth={13} strokeLinecap="round" />
        <Joint cx={164} cy={182} strong />
      </g>
      <Joint cx={158} cy={114} />
    </>
  )
}

const drawings: Record<MovementId, (props: { playing: boolean }) => React.JSX.Element> = {
  'knee-extension': KneeExtension,
  'calf-raise': CalfRaise,
  squat: Squat,
  'hip-abduction': HipAbduction,
}
