// The homepage's door arrow: a long shaft and an open head, drawn in currentColor.
export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={`arrow ${className ?? ""}`} viewBox="0 0 132 28" aria-hidden="true" focusable="false">
      <g>
        <path d="M0 14H112" />
        <path d="M99 2L114 14L99 26" />
      </g>
    </svg>
  );
}
