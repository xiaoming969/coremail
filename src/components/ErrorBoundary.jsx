import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('日历组件渲染失败:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            background: '#fef2f2',
            color: '#991b1b',
            height: '100vh',
            fontFamily: 'sans-serif',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>渲染拦截：应用发生异常</h2>
          <p>请将以下错误信息反馈给开发者，以便快速修复：</p>
          <pre
            style={{
              background: '#fff',
              padding: '20px',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              marginTop: '20px',
              overflow: 'auto',
              fontSize: '13px',
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
