import React, {ErrorInfo, JSX, ReactNode} from 'react';

// Styles
import * as styles from './ErrorBoundary.module.less';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: ErrorInfo | null;
}

/**
 * React error handler
 *
 * @class
 * @classdesc Typical error handler of React Error events
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  /**
   * @param {object} error
   * @returns {{hasError: boolean}}
   */
  static getDerivedStateFromError(error: object): object {
    return { hasError: true, errorInfo: error };
  }

  /**
   * @class
   * @param {props} props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  /**
   * Handle React error
   *
   * @param {Error} error
   * @param {ErrorInfo} errorInfo
   * @returns {void}
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
  }

  /**
   * Render component
   *
   * @returns {JSX.Element}
   */
  render(): JSX.Element | ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className={styles.uiError}>
          <i className="fas fa-dizzy" />
          <h1>Something went wrong.</h1>
        </div>
      );
    }

    return children;
  }
}
