import React, { MouseEventHandler, useEffect, useState } from 'react';
import styles from './personalData.module.css';
import { VerseInterface } from '@/types/types';
import axios from 'axios';
import { Session } from 'next-auth';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner/spinner';

interface PersonalDataProps {
	onClose: MouseEventHandler;
	session: Session | null;
}

interface Bookmarks {
	bookName: String;
	verses: VerseInterface[];
}

interface Note {
	text: TrustedHTML;
	createdAt: String;
	wordIds: Number[];
	label: String;
}

const menus = [
	{
		name: 'Bookmarks',
		id: 'bookmark-section',
	},
	{
		name: 'Notes',
		id: 'note-section',
	},
];

export default function PersonalData({ onClose, session }: PersonalDataProps) {
	const navigate = useRouter();

	const [bookmarks, setBookmarks] = useState<Bookmarks[]>([]);
	const [notes, setNotes] = useState<Note[]>([]);
	const [isFetching, setFetching] = useState(true);

	const fetchBookmarks = async () => {
		const data = {
			userId: session?.mongoDb.id,
		};

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getall-bookmark`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					if (res.data.status == 200) {
						setBookmarks(res.data.bookmarks);
					}
					setFetching(false);
				});
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	};

	const fetchNotes = async () => {
		const data = {
			userId: session?.mongoDb.id,
		};

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getall-note`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					if (res.data.status == 200) {
						setNotes(res.data.notes);
					}
					setFetching(false);
				});
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	};

	const [selectedMenu, setSelectedMenu] = useState<String>('Bookmarks');

	const handleChangeMenu = (menu: String) => {
		setSelectedMenu(menu);
	};

	useEffect(() => {
		if (selectedMenu == 'Bookmarks') {
			fetchBookmarks();
		} else {
			fetchNotes();
		}
	}, [selectedMenu]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.menuBar}>
					{menus.map((menu) => (
						<div
							onClick={() => handleChangeMenu(menu.name)}
							className={styles.menu}
							id={menu.id}
							key={menu.id}
							style={{
								backgroundColor:
									selectedMenu == menu.name
										? 'var(--bg)'
										: '',
							}}
						>
							{menu.name}
						</div>
					))}
				</div>

				<div className={styles.closeButton} onClick={onClose}>
					<img src="/close.png" />
				</div>
			</div>

			<div className={styles.content}>
				{selectedMenu == 'Bookmarks' ? (
					<>
						{isFetching && <Spinner message="Memuat data" />}

						{!isFetching && bookmarks?.length > 0 && (
							<>
								{bookmarks.map((bookmark, index) => (
									<Accordion
										key={`bookmark-${index}`}
										className={styles.accordion}
									>
										<AccordionSummary
											className={styles.title}
											expandIcon={
												<ExpandMoreIcon
													sx={{ color: 'white' }}
												/>
											}
										>
											{bookmark.bookName}
										</AccordionSummary>

										<div className={styles.verses}>
											{bookmark.verses.map((verse) => (
												<div
													className={styles.verse}
													key={`verse-${verse.wordId}`}
													onClick={() =>
														navigate.push(
															`/alkitab/${bookmark.bookName}/${verse.chapterNum}#${verse.verseNum}`
														)
													}
												>
													<span
														className={styles.tag}
													>
														[
														{Number(
															verse.chapterNum
														)}{' '}
														:{' '}
														{Number(verse.verseNum)}
														]
													</span>
													<span
														className={styles.word}
													>
														{verse.word}
													</span>
												</div>
											))}
										</div>
									</Accordion>
								))}
							</>
						)}

						{!isFetching && bookmarks?.length === 0 && (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '200px',
									fontWeight: 'bold',
									fontSize: '1.3rem',
								}}
							>
								Tidak ada bookmarks.
							</div>
						)}
					</>
				) : selectedMenu == 'Notes' ? (
					<>
						{isFetching && <Spinner message="Memuat data" />}

						{!isFetching && notes?.length > 0 && (
							<>
								{notes.map((note, index) => (
									<Accordion
										key={`note-${index}`}
										className={styles.accordion}
									>
										<AccordionSummary
											className={styles.title}
											expandIcon={
												<ExpandMoreIcon
													sx={{ color: 'white' }}
												/>
											}
										>
											{note.label}
										</AccordionSummary>

										<div className={styles.verses}>
											<div
												className={styles.verse}
												key={`verse-${note.label}`}
												// onClick={() =>
												// 	navigate.push(
												// 		`/alkitab/${note.bookName}/${verse.chapterNum}#${verse.verseNum}`
												// 	)
												// }
											>
												<span className={styles.tag}>
													<div
														className={
															styles.renderNoteHTML
														}
														dangerouslySetInnerHTML={{
															__html: note.text,
														}}
													/>
												</span>
											</div>
										</div>
									</Accordion>
								))}
							</>
						)}

						{!isFetching && notes?.length === 0 && (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '200px',
									fontWeight: 'bold',
									fontSize: '1.3rem',
								}}
							>
								Tidak ada notes.
							</div>
						)}
					</>
				) : null}
			</div>
		</div>
	);
}
