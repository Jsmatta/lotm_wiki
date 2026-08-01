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
          <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl border-4 border-error p-8 max-w-lg text-center">
            <h3 className="font-bold text-2xl text-error mb-4">Something went wrong!</h3>
            <p className="opacity-80 mb-6">{state.error?.message || "An unexpected error occurred."}</p>
            <button type="button" className="btn btn-primary" onClick={this.handleReturnHome}>
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return props.children;
  }
}
