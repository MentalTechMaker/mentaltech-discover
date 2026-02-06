import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Une erreur est survenue
              </h2>
              <p className="text-text-secondary mb-6">
                L'application a rencontré un problème inattendu.
              </p>
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full border-2 border-gray-200 text-text-primary py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Recharger la page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
