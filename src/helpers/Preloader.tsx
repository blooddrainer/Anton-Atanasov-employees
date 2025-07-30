import React, { JSX } from 'react';
import clsx from 'clsx';

interface Props {
  classes?: string;
}

/**
 * Loading fallback
 *
 * @returns {JSX.Element}
 */
const Preloader = ({ classes }: Props): JSX.Element => (
  <div className={clsx(['lds-roller', classes])}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default React.memo(Preloader);
