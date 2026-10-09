import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-300 text-base-content p-6">
          <div className="card bg-base-100 shadow-2xl p-6 max-w-lg border border-error/30">
            <h2 className="text-xl font-bold text-error mb-2">エラーが発生しました</h2>
            <p className="text-sm opacity-80 mb-4">画面の描画中に問題が発生しました：</p>
            <pre className="bg-base-200 p-3 rounded text-xs font-mono overflow-auto max-h-40 text-error">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm mt-4"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
