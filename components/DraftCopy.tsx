// Copy that exists but isn't Ian's yet. Ships visible and marked, so it can
// be read in place and rewritten; never passes as finished.
export function DraftCopy({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border-l-4 border-door-magenta pl-5">
      <p className="mb-4 font-mono text-small text-door-pink">[draft: Ian rewrites this]</p>
      {children}
    </div>
  );
}
