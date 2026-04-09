'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Custom fallback UI - overrides default */
  fallback?: ReactNode;
  /** 'root' shows full-screen error; 'view' shows inline card */
  variant?: 'root' | 'view';
  /** Display name shown in the error UI */
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.name ?? 'unknown'}]`, error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { variant = 'view', name } = this.props;
    const message = this.state.error?.message ?? 'An unexpected error occurred';

    if (variant === 'root') {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center font-mono">
          <div className="max-w-lg w-full mx-4 border border-red-500 bg-red-950/20 p-8">
            <div className="text-red-400 text-xs uppercase tracking-widest mb-2">System Error</div>
            <h1 className="text-white text-xl mb-4">Dashboard Failure</h1>
            <p className="text-red-300 text-sm mb-6 font-mono break-words">{message}</p>
            <button
              onClick={this.reset}
              className="px-4 py-2 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-400/10 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // variant === 'view'
    return (
      <div className="border border-red-500/50 bg-red-950/10 p-6 font-mono">
        <div className="text-red-400 text-xs uppercase tracking-widest mb-1">
          {name ? `${name} Error` : 'Component Error'}
        </div>
        <p className="text-red-300 text-sm mb-4 break-words">{message}</p>
        <button
          onClick={this.reset}
          className="px-3 py-1 border border-cyan-400/60 text-cyan-400 text-xs hover:bg-cyan-400/10 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
}
