// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Dashboard crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center mt-10">Dashboard failed to load. Check console.</div>;
    }
    return this.props.children;
  }
}