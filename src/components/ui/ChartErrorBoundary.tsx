"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ChartErrorBoundaryProps {
  children: ReactNode;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ChartErrorBoundary extends Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ChartErrorBoundary]", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[350px] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white/[0.03] border border-white/10 p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-energy-rose/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="text-base font-medium text-slate-300">
            Unable to load this chart
          </p>
          {this.state.error?.message && (
            <p className="max-w-md text-center text-xs text-text-muted/60">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleRetry}
            className="mt-1 rounded-lg bg-energy-green/10 px-5 py-2 text-sm font-medium text-energy-green transition-colors hover:bg-energy-green/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy-green"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
