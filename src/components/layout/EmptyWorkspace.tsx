export function EmptyWorkspace() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-surface text-text-secondary">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="mb-4 text-text-muted"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="mb-1 text-lg font-medium text-text-primary">Welcome to Tester</h2>
      <p className="max-w-sm text-center text-sm text-text-muted">
        Select a request from the sidebar or create a new one to get started.
      </p>
    </div>
  );
}
