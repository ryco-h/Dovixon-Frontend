import React from 'react';
import styles from './spinner.module.css';

interface SpinnerParam {
	message?: string;
}

export default function Spinner(param: SpinnerParam) {
	return (
		<div className={styles.overlay}>
			<div className={styles.spinner}></div>
			{param.message ? (
				<div className={styles.message}>
					{param.message}
					<span className={styles.dots}></span>
				</div>
			) : null}
		</div>
	);
}
