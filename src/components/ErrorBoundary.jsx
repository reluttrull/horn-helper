import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error (optional)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <div>
        <h3>Something went wrong.</h3>
        <p>Please try refreshing the page.
          {/* <a href={"mailto:hornhelperapp@gmail.com?subject=Error%Reported&body="
            +this.state.error+this.state.errorInfo?.componentStack}>reporting the error.</a> */}
        </p>
      </div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;