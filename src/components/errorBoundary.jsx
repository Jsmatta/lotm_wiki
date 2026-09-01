import { Component } from 'preact';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // A hard reload is the only reliable recovery once the tree has thrown.
  // `BASE_URL` keeps this inside the app when deployed under a subpath, and the
  // `#/` targets the HashRouter's home route rather than the server root.
  handleReturnHome = () => {
    window.location.href = `${import.meta.env.BASE_URL}#/`;
    window.location.reload();
  };

  render(props, state) {
    if (state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-base-200 border-2 border-error brutal-shadow-xl p-8 max-w-lg text-center font-mono space-y-4">
            <div className="inline-block bg-error text-error-content font-mono font-bold text-xs px-2 py-0.5 border border-black uppercase">
              [!] CONTAINMENT BREACH
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tight text-base-content">
              Archive Corruption Detected
            </h3>
            <p className="text-xs text-base-content/80 p-3 bg-base-100 border border-base-content/20 text-left overflow-x-auto">
              {state.error?.message || "An unexpected eldritch contamination occurred."}
            </p>
            <button
              type="button"
              className="btn btn-sm btn-primary rounded-none border-2 border-black font-mono font-bold uppercase tracking-wider brutal-shadow-xs brutal-btn mt-2 w-full"
              onClick={this.handleReturnHome}
            >
              PURGE STATE & RETURN TO ARCHIVE ROOT
            </button>
          </div>
        </div>
      );
    }

    return props.children;
  }
}
