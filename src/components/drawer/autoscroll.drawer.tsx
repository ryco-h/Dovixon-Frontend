import React, { useEffect, useState } from 'react';

type AutoScrollDrawerProps = {
	open: boolean;
	height?: string;
	children: React.ReactNode;
};

const AutoScrollDrawer: React.FC<AutoScrollDrawerProps> = ({
	open,
	height = '100%',
	children,
}) => {
	const [visible, setVisible] = useState(open);

	useEffect(() => {
		if (open) setVisible(true);
		else {
			// Delay unmount to allow animation
			const timeout = setTimeout(() => setVisible(false), 300);
			return () => clearTimeout(timeout);
		}
	}, [open]);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: '45%',
				// bottom: '50%',
				width: '50px',
				margin: 'auto',
				maxHeight: open ? height : '0px',
				opacity: open ? 1 : 0,
				transform: open ? 'translateY(0)' : 'translateY(20px)',
				transition: 'all 0.3s ease',
				backgroundColor: 'var(--terBg)',
				boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
				borderRadius: '0 12px 12px 0',
				zIndex: 10,
				pointerEvents: open ? 'auto' : 'none',
				color: 'white',
			}}
		>
			{visible && (
				<div
					style={{
						height,
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						paddingTop: '.5rem',
						paddingBottom: '.5rem',
						gap: '1rem',
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default AutoScrollDrawer;
