import { Box, Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { RichTextEditor, type RichTextEditorRef } from 'mui-tiptap';
import EditorMenuControls from './editorMenuControls';
import useExtensions from './useExtensions';
import { VerseEntry } from '@/types/types';

import './editor.css';
import { Session } from 'next-auth';
import axios from 'axios';

interface NoteProps {
	label: String;
	selectedVerse: VerseEntry[];
	session: Session | null;
	handleLoading: Function;
	onClose: Function;
}

export default function Editor({
	label,
	selectedVerse,
	session,
	handleLoading,
	onClose,
}: NoteProps) {
	const extensions = useExtensions({
		placeholder: 'Silahkan tulis catatan disini...',
	});
	const rteRef = useRef<RichTextEditorRef>(null);
	const [isEditable, setIsEditable] = useState(true);
	const [showMenuBar, setShowMenuBar] = useState(true);

	const [submittedContent, setSubmittedContent] = useState('');

	const handleSubmitNote = async (text: String) => {
		handleLoading();

		if (!session?.mongoDb.id) {
			handleLoading();
			onClose();
			return window.alert('Silahkan login terlebih dahulu');
		}

		let wordIds = selectedVerse.map((verse) => {
			return verse.detail.wordId;
		});

		const data = {
			note: {
				text,
				label,
				wordIds,
			},
			userId: session?.mongoDb.id,
		};

		console.log({ label, selectedVerse, text });

		let bookmarks: Array<object> = [];
		selectedVerse.map((verse) => {
			bookmarks.push(verse.detail);
		});

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/save-note`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					console.log(res.data);
					handleLoading();
					onClose();
				});
		} catch (error) {
			console.log(error);
			handleLoading();
			onClose();
		}
	};

	return (
		<>
			<Box
				sx={{
					padding: '1rem 0',
				}}
			>
				<RichTextEditor
					ref={rteRef}
					extensions={extensions}
					content={''}
					autofocus
					editable={isEditable}
					renderControls={() => <EditorMenuControls />}
					editorProps={{}}
					RichTextFieldProps={{
						RichTextContentProps: {
							classes: { root: 'override-field' },
						},
						classes: { menuBar: 'override' },
						variant: 'outlined',
						footer: (
							<Stack
								direction="row"
								justifyContent={'flex-end'}
								spacing={2}
								sx={{
									borderTopStyle: 'solid',
									borderTopWidth: 1,
									borderTopColor: (theme) =>
										theme.palette.divider,
									py: 1,
									px: 1.5,
								}}
							>
								<Button
									sx={{
										bgcolor: 'var(--bg)',
										px: 2,
										textTransform: 'capitalize',
									}}
									variant="contained"
									size="small"
									onClick={() => {
										handleSubmitNote(
											rteRef.current?.editor?.getHTML() ??
												''
										);
									}}
								>
									Simpan
								</Button>
							</Stack>
						),
					}}
				></RichTextEditor>
			</Box>
		</>
	);
}
