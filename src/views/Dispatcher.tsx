import React, {JSX } from 'react';

// Routes
import UserRoutes from '@/routes/user.routes';

// Styles
import * as styles from './Dispatcher.module.less';

/**
 * Logged In dispatcher
 *
 * @returns {JSX.Element}
 */
function Dispatcher(): JSX.Element {
  return (
    <>
      <div className={styles.uiWrapper}>
        <div className={styles.uiContainer}>
          <div className={styles.uiContent}>
            <UserRoutes />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dispatcher;
