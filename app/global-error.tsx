'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="max-w-lg w-full mx-4 border border-red-500 bg-red-950/20 p-8">
          <div className="text-red-400 text-xs uppercase tracking-widest mb-2">System Error</div>
          <h1 className="text-white text-xl mb-4">Dashboard Failure</h1>
          <p className="text-red-300 text-sm mb-6 font-mono break-words">
            {error.message ?? 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-zinc-600 text-xs mb-4 font-mono">digest: {error.digest}</p>
          )}
          <button
            onClick={unstable_retry}
            className="px-4 py-2 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-400/10 transition-colors"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
