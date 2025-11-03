// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
  state = { 
    hasError: false, 
    error: null,
    errorInfo: null 
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // LOG FULL CRASH
    console.group('🚨 REACT ERROR BOUNDARY');
    console.error('Error:', error);
    console.error('Stack:', errorInfo.componentStack);
    console.groupEnd();

    this.setState({ 
      error, 
      errorInfo 
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleCopyError = () => {
    const errorText = `
🚨 APP CRASH REPORT
Time: ${new Date().toLocaleString()}
Error: ${this.state.error?.message || 'Unknown'}
Stack:
${this.state.errorInfo?.componentStack || 'No stack'}
    `.trim();

    navigator.clipboard.writeText(errorText);
    alert('Error copied to clipboard! Paste in support chat.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="text-4xl" />
                <div>
                  <h1 className="text-2xl font-bold">App Crashed!</h1>
                  <p className="text-red-100">Don't worry — your data is safe</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-mono text-gray-700 break-all">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:underline font-medium">
                  Show technical details
                </summary>
                <pre className="mt-2 text-xs bg-gray-900 text-gray-300 p-3 rounded overflow-x-auto">
                  {this.state.errorInfo?.componentStack || 'No stack trace'}
                </pre>
              </details>

              <p className="text-gray-600 text-sm">
                This usually happens due to a temporary glitch. Try reloading!
              </p>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <FiRefreshCw />
                Reload Page
              </button>
              <button
                onClick={this.handleCopyError}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm"
              >
                Copy Error
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-3 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact support with the error above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}