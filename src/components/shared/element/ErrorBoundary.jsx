import { Component } from 'react';
import { Result, Button } from 'antd';
import '../antd/ErrorPage/errorPage.scss';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          className="error-boundary"
          status="500"
          title="500"
          subTitle="Sorry, something went wrong. Please refresh the page by pressing F5 or clicking the button below."
          extra={
            <Button
              className="redirect-btn"
              type="primary"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
