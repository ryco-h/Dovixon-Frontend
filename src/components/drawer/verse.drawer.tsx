import { VerseEntry } from '@/types/types';
import React, { useEffect, useState } from 'react';

type VerseDrawerProps = {
	open: boolean;
	height?: string;
	children: React.ReactNode;
};

const VerseDrawer: React.FC<VerseDrawerProps> = ({
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
				position: 'sticky',
				bottom: 0,
				width: '80%',
				margin: 'auto',
				overflow: 'hidden',
				maxHeight: open ? height : '0px',
				opacity: open ? 1 : 0,
				transform: open ? 'translateY(0)' : 'translateY(20px)',
				transition: 'all 0.3s ease',
				backgroundColor: 'var(--terBg)',
				boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
				borderTopLeftRadius: '12px',
				borderTopRightRadius: '12px',
				zIndex: 10,
				pointerEvents: open ? 'auto' : 'none',
			}}
		>
			{visible && (
				<div style={{ height, overflowY: 'auto' }}>{children}</div>
			)}
		</div>
	);
};

export default VerseDrawer;
