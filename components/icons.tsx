export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function Mark({ className }: { className?: string }) {
  // A gable drawn as a single line: the studio's mark.
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="15.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 23V14.5L16 8l8 6.5V23" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 23v-5h6v5" stroke="#a67c3d" strokeWidth="1.5" />
    </svg>
  )
}

export function Dimension({ label, width = 260 }: { label: string; width?: number }) {
  return (
    <svg className="dim" width={width} height="26" viewBox={`0 0 ${width} 26`} fill="none" aria-hidden="true">
      <path d={`M1 4v18M${width - 1} 4v18M1 13h${width - 2}`} stroke="currentColor" />
      <path d={`M1 13l7-4v8zM${width - 1} 13l-7-4v8z`} fill="currentColor" />
      <rect x={width / 2 - label.length * 3.6 - 8} y="5" width={label.length * 7.2 + 16} height="16" fill="var(--paper)" />
      <text x={width / 2} y="17" textAnchor="middle" fontSize="11" fill="currentColor" letterSpacing="1.2">{label}</text>
    </svg>
  )
}

export const typeIcons: Record<string, React.ReactNode> = {
  kitchen: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="12" width="22" height="12" /><path d="M3 16h22M9 12V4h10v8M14 16v8" /></svg>,
  bathroom: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 14h22v3a7 7 0 0 1-7 7h-8a7 7 0 0 1-7-7zM7 14V6a3 3 0 0 1 6 0" /></svg>,
  basement: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 10h24M5 10v15h18V10M5 10l9-7 9 7M9 25v-6h4v6" /><path d="M2 16h3M23 16h3" strokeDasharray="1 2" /></svg>,
  'whole-home': <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 25V12l11-8 11 8v13zM3 18h22M14 4v21" /></svg>,
  addition: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 25V13l7-6 7 6v12zM17 25V9h8v16" /><path d="M21 3v4M19 5h4" /></svg>,
}
