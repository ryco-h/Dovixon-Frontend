import { VerseEntry } from '@/types/types';
import React, { useState } from 'react';

import styles from './noteDialog.module.css';
import Editor from '@/components/editor/editor';
import { Session } from 'next-auth';
import Spinner from '@/components/spinner/spinner';

interface NoteDialogProps {
	selectedVerse: VerseEntry[];
	label: String;
	session: Session | null;
	onClose: Function;
}

export default function NoteDialogContent({
	selectedVerse,
	label,
	session,
	onClose,
}: NoteDialogProps) {
	const [isLoading, setLoading] = useState(false);
	const handleLoading = () => setLoading((prev) => !prev);
	if (isLoading) return <Spinner message="Mohon tunggu" />;
	return (
		<div className={styles.container} id="tiptap-editor">
			<div className={styles.title}>{label}</div>

			<div className={styles.content}>
				<Editor
					session={session}
					label={label}
					selectedVerse={selectedVerse}
					handleLoading={handleLoading}
					onClose={onClose}
				/>
			</div>
		</div>
	);
}
