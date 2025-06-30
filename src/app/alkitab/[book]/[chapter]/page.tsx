'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import styles from './chapter.module.css';
import axios from 'axios';
import Spinner from '@/components/spinner/spinner';
import { Book, ListBook, VerseEntry, VerseInterface } from '@/types/types';
import { useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import VerseDrawer from '@/components/drawer/verse.drawer';
import { useSession } from 'next-auth/react';
import { emptyVerses } from '@/properties';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import SearchBible from './components/searchBible';
import { Tooltip } from 'react-tooltip';
import PersonalData from './components/personalData';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import NoteDialogContent from './components/noteDialogContent';

const drawerWidth = 120;

const StyledDialog = styled<React.ComponentType<DialogProps>>(Dialog)(
	({ theme }) => ({
		position: 'absolute',
		height: '100%',
		width: '100%',
		right: 'unset !important',
		left: 'unset !important',
		bottom: 'unset !important',
		top: 'unset !important',
		'& .MuiPaper-root': {
			position: 'relative',
			backgroundColor: 'var(--terBg)',
			padding: theme.spacing(2),
			color: 'white',
			zIndex: 10,
		},
	})
);

export default function Chapter({
	params,
}: {
	params: Promise<{ book: string; chapter: number }>;
}) {
	const containerRef = useRef(null);
	const containerPersonalDataRef = useRef(null);
	const containerCreateNoteRef = useRef(null);

	const [isLoading, setLoading] = useState(false);
	const { data: session } = useSession();

	const [isOpen, setIsOpen] = useState(false);
	const [isMuiDrawerOpen, setMuiDrawer] = useState(false);
	const toggleMuiDrawer = () => {
		setMuiDrawer((prev) => !prev);
	};

	const navigate = useRouter();
	const { book, chapter } = use(params);
	const [activeBook, setBook] = useState<string>();
	const [filteredBook, setFilteredBook] = useState<
		VerseInterface[] | undefined
	>();

	const [chapterNavigation, setChapterNavigation] = useState<Number>();

	const [listBook, setListBook] = useState<ListBook[]>([]);
	const fetchListBook = async () => {
		await axios
			.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Alkitab/GetListBook`)
			.then((res) => {
				if (res.data.status == 200) {
					setListBook(res.data.data);
					localStorage.setItem(
						'listBook',
						JSON.stringify(res.data.data)
					);
				}
			});
	};

	useEffect(() => {
		if (listBook && listBook.length > 0) {
			setChapterNavigation(
				listBook.find(
					(VBook) =>
						VBook.bookName.toLowerCase() == book.toLowerCase()
				)?.chaptersCount
			);
		}
	}, [listBook]);

	useEffect(() => {
		const localStorageBook: Book = localStorage.getItem('book')
			? JSON.parse(localStorage.getItem('book') || '')
			: undefined;

		if (!localStorageBook) {
			fetchBibleByBook(book);
		}

		if (
			localStorageBook &&
			localStorageBook.bookName.toLowerCase() != book
		) {
			localStorage.removeItem('book');
			fetchBibleByBook(book);
		}

		const localStorageListBook: ListBook = localStorage.getItem('ListBook')
			? JSON.parse(localStorage.getItem('ListBook') || '{}')
			: undefined;

		if (!localStorageListBook) {
			fetchListBook();
		}
	}, []);

	useEffect(() => {
		if (localStorage.getItem('book')) {
			const FetchedBook: any = JSON.parse(
				localStorage.getItem('book') || ''
			);
			filterBookByChapter(FetchedBook, chapter);
		}
	}, [activeBook]);

	const fetchBibleByBook = async (
		book: string | number,
		movePreviousBook?: boolean
	) => {
		setFilteredBook(undefined);

		const bookNum =
			typeof book === 'number' ? book : getBookNumberFromUrl(book);

		try {
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/Alkitab/GetBook?bookNum=${bookNum}`
			);
			const data = res.data;

			if (movePreviousBook) {
				navigate.push(
					`/alkitab/${bookNames[Number(bookNum)].toLowerCase()}/${
						data?.chapters.length
					}`
				);
				return;
			}

			localStorage.setItem('book', JSON.stringify(data));
			setBook(data.bookName.toString());
		} catch (error) {
			console.error('Failed to fetch book:', error);
		}
	};

	const filterBookByChapter = (book: Book | undefined, chapter: any) => {
		setFilteredBook(undefined);

		const filteredBook = book
			? book.verses
					.filter((verse) => verse.chapterNum == chapter)
					.map((verse) => verse)
			: undefined;

		setFilteredBook(filteredBook as VerseInterface[]);
	};

	const nextOrPrevBook = async (arrow: 'next' | 'previous') => {
		setBook(undefined);

		const localBook = JSON.parse(localStorage.getItem('book') || '{}');
		if (!localBook?.bookNum || !localBook?.chapters) return;

		const currentChapter = Number(chapter);
		const maxChapter = localBook.chapters.length;

		let targetBook = localBook.bookNum;
		let targetChapter = currentChapter;

		const isFirst = currentChapter === 1;
		const isLast = currentChapter === maxChapter;

		if (arrow === 'previous' && isFirst && localBook.previous) {
			targetBook = localBook.previous.bookNum;
			targetChapter = localBook.previous.lastChapter;
		} else if (arrow === 'next' && isLast && localBook.next) {
			targetBook = localBook.next;
			targetChapter = 1;
		} else {
			targetChapter =
				arrow === 'previous' ? currentChapter - 1 : currentChapter + 1;
		}

		navigate.push(
			`/alkitab/${bookNames[
				Number(targetBook)
			].toLowerCase()}/${targetChapter}`
		);
	};

	const [selectedVerse, setSelectedVerse] = useState<VerseEntry[]>([]);
	const handleSelectedVerse = (
		stringVerse: string,
		order: number,
		detail: any
	) => {
		setSelectedVerse((prev) => {
			const exists = prev.find((v) => v.verse === stringVerse);

			if (exists) {
				return prev.filter((v) => v.verse !== stringVerse);
			}

			const newList = [...prev, { verse: stringVerse, order, detail }];
			return newList.sort((a, b) => a.order - b.order);
		});
	};

	const renderBookmarkButton = (
		selectedVerse: VerseEntry[],
		bookmarks: VerseInterface[]
	): string => {
		const bookmarkStates = selectedVerse.map((verse) =>
			bookmarks.some((item) => item.wordId === verse.detail.wordId)
		);

		const uniqueStates = new Set(bookmarkStates);

		if (uniqueStates.size === 1) {
			return uniqueStates.has(true) ? 'all-bookmarked' : 'non-bookmarked';
		}
		return 'mixed';
	};

	const handleSaveBookmark = async () => {
		if (!session?.mongoDb.id)
			return window.alert('Silahkan login terlebih dahulu');

		setLoading(true);

		let bookmarks: Array<object> = [];
		selectedVerse.map((verse) => {
			bookmarks.push(verse.detail);
		});

		let userId = session?.mongoDb.id;

		const data = {
			bookmark: bookmarks,
			userId,
		};

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/save-bookmark`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					handleGetBookmarks();
					setSelectedVerse([]);
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleRemoveBookmark = async () => {
		setLoading(true);
		if (!session?.mongoDb.id)
			return window.alert('Silahkan login terlebih dahulu');

		let bookmarks: Array<object> = [];
		selectedVerse.map((verse) => {
			bookmarks.push(verse.detail);
		});

		let userId = session?.mongoDb.id;

		const data = {
			bookmark: bookmarks,
			userId,
		};

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/remove-bookmark`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					handleGetBookmarks();
					setSelectedVerse([]);
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (selectedVerse.length != 0) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [selectedVerse]);

	const [bookmarks, setBookmarks] = useState<VerseInterface[]>(emptyVerses);
	const handleGetBookmarks = async () => {
		const data = {
			chapter: Number(chapter),
			userId: session?.mongoDb.id,
		};

		const { token } = await fetch('/api/sign-token').then((res) => {
			return res.json();
		});

		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/get-bookmark`,
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
				});
		} catch (error) {
			console.log(error);
		}
	};

	const hasFetched = useRef(false);

	useEffect(() => {
		if (session?.mongoDb.id && !hasFetched.current) {
			handleGetBookmarks();
			hasFetched.current = true;
		}
	}, [session]);

	const [showModal, setShowModal] = useState(false);
	const handleModal = () => setShowModal((prev) => !prev);

	const [showPersonalData, setShowPersonalData] = useState(false);
	const handleModalPersonalData = () => {
		setShowPersonalData((prev) => !prev);
	};

	useEffect(() => {
		if (!filteredBook) return; // guard until data exists

		const hash = window.location.hash;
		if (!hash) return;

		const id = hash.slice(1);
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}, [filteredBook]);

	const handleCopyVerses = (verses: VerseEntry[]) => {
		let copiedString;

		let verseString = verses.map((verse) => {
			return ` \n[${verse.order}]	${verse.detail.word}`.slice(0, -1);
		});

		const fullUrl = window.location.href;
		const baseUrl = fullUrl.split('/').slice(0, 4).join('/');

		copiedString = `${
			decodeURIComponent(book).charAt(0).toUpperCase() +
			decodeURIComponent(book).slice(1)
		} ${chapter} : ${renderVerses(
			selectedVerse
		)}\n${verseString}.\n\n${baseUrl}/${decodeURIComponent(
			book
		).toLowerCase()}/${verses[0].detail.chapterNum}#${
			verses[0].detail.verseNum
		}`;

		navigator.clipboard.writeText(copiedString);
	};

	const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false);
	const handleShowCreateNoteDialog = () => {
		if (session?.mongoDb.id) {
			setShowCreateNoteDialog((prev) => !prev);
		} else {
			window.alert('Silahkan login terlebih dahulu');
		}
	};

	if (isLoading) return <Spinner message="Mohon tunggu" />;
	if (!filteredBook) return <Spinner message="Memuat kitab" />;

	return (
		<div className={styles.container} id="alkitab-container">
			<div className={styles.wrapper} ref={containerRef}>
				<div className={styles.header}>
					<div
						className={styles.menu}
						onClick={handleModal}
						style={{
							marginLeft: '5vw',
							marginRight: '5vw',
						}}
						id="searchBible"
					>
						<img src="/search.png" alt="search" />
					</div>
					<Tooltip
						style={{ fontSize: '14px' }}
						anchorSelect="#searchBible"
						clickable
					>
						Cari Kitab
					</Tooltip>

					<div className={styles.centerHeader}>
						<div
							className={styles.arrow}
							onClick={() => {
								nextOrPrevBook('previous');
							}}
						>
							<img src="/previous.png" alt="previous" />
						</div>
						<div className={styles.book}>
							{decodeURIComponent(book)} {chapter}
						</div>
						<div
							className={styles.arrow}
							onClick={() => nextOrPrevBook('next')}
						>
							<img src="/next.png" alt="next" />
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginLeft: '5vw',
							marginRight: '5vw',
							gap: '1rem',
						}}
					>
						<div
							id="navigateChapter"
							className={styles.menu}
							onClick={toggleMuiDrawer}
						>
							<img src="/bible-opened.png" alt="bible" />
						</div>
						<Tooltip
							style={{
								fontSize: '14px',
								zIndex: 99,
							}}
							anchorSelect="#navigateChapter"
							clickable
						>
							Pilih Pasal
						</Tooltip>

						<div
							style={{
								display: session?.mongoDb.id ? 'block' : 'none',
							}}
							id="personalData"
							className={styles.menu}
							onClick={handleModalPersonalData}
						>
							<img src="/user-book.png" alt="user-book" />
						</div>
						<Tooltip
							style={{ fontSize: '14px' }}
							anchorSelect="#personalData"
							clickable
						>
							Lihat data pribadi
						</Tooltip>
					</div>
				</div>

				<div className={`${styles.content} content-alkitab`}>
					{filteredBook.map((verse, index) => (
						<span
							key={verse.id || 'verse' + index}
							className={styles.verse}
						>
							<a
								className={styles.number}
								id={verse.wordId?.toString()}
								href={`#${verse.verseNum?.toString()}`}
							>
								{bookmarks.length > 0 &&
								bookmarks.find(
									(bookmark) =>
										bookmark.wordId == verse.wordId
								) ? (
									<img src={'/bookmark.png'} width={20} />
								) : null}

								{verse.verseNum?.toString()}
							</a>
							<span
								onClick={() =>
									handleSelectedVerse(
										`${decodeURIComponent(
											book
										)} ${chapter} : ${verse.verseNum}`,
										Number(verse.verseNum),
										verse
									)
								}
								style={{
									borderBottom: selectedVerse.find(
										(existedVerse) =>
											existedVerse.order == verse.verseNum
									)
										? 'white 3px dotted'
										: 'none',
									padding: '.3rem 0 .3rem 0',
									backgroundColor:
										bookmarks.length > 0 &&
										bookmarks.find(
											(bookmark) =>
												bookmark.wordId == verse.wordId
										)
											? '#7080b150'
											: 'transparent',
								}}
								className={styles.word}
							>
								{verse.word}
							</span>
						</span>
					))}
				</div>

				<VerseDrawer open={isOpen}>
					{selectedVerse.length != 0 ? (
						<div className={styles.verseDrawer}>
							<div className={styles.selectedVerse}>
								<span>
									{decodeURIComponent(book)} {chapter}
								</span>
								<span>&nbsp;:&nbsp;</span>
								<div className={styles.verse}>
									<span>{renderVerses(selectedVerse)}</span>
								</div>
							</div>
							<div className={styles.tools}>
								{selectedVerse.length == 1 ? (
									<div className={styles.tool}>
										<img
											className={styles.toolIcon}
											src="/share.png"
											alt="share"
										/>
										<span>Share</span>
									</div>
								) : null}

								<div
									className={styles.tool}
									onClick={() =>
										handleCopyVerses(selectedVerse)
									}
								>
									<img
										className={styles.toolIcon}
										src="/copy.png"
										alt="copy"
									/>
									<span>Copy</span>
								</div>

								<div
									className={styles.tool}
									onClick={handleShowCreateNoteDialog}
								>
									<img
										className={styles.toolIcon}
										src="/note.png"
										alt="note"
									/>
									<span>Note</span>
								</div>

								{renderBookmarkButton(
									selectedVerse,
									bookmarks
								) == 'all-bookmarked' ? (
									<div
										className={styles.tool}
										onClick={() => handleRemoveBookmark()}
									>
										<img
											className={styles.toolIcon}
											src="/bookmark.png"
											alt="bookmark"
										/>
										<span>Hapus Bookmark</span>
									</div>
								) : renderBookmarkButton(
										selectedVerse,
										bookmarks
								  ) == 'non-bookmarked' ? (
									<div
										className={styles.tool}
										onClick={() => handleSaveBookmark()}
									>
										<img
											className={styles.toolIcon}
											src="/bookmark.png"
											alt="bookmark"
										/>
										<span>Bookmark</span>
									</div>
								) : null}
							</div>
						</div>
					) : null}
				</VerseDrawer>

				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							height: '70vh',
							top: '15vh',
							borderRadius: '20px 0 0 20px ',
							backgroundColor: 'var(--terBg)',
						},
					}}
					variant="persistent"
					anchor="right"
					open={isMuiDrawerOpen}
					onClose={toggleMuiDrawer}
				>
					<div className={styles.drawerContainer}>
						<div
							className={styles.closeDrawer}
							onClick={toggleMuiDrawer}
						>
							Tutup
						</div>
						<div className={styles.chapterNavigation}>
							{Array.from(
								{ length: Number(chapterNavigation) },
								(_, i) => (
									<div
										style={{
											backgroundColor:
												chapter == i + 1
													? 'var(--bg)'
													: '',
										}}
										onClick={() => {
											if (chapter == i + 1) return;
											else
												navigate.push(
													`/alkitab/${book.toLowerCase()}/${
														i + 1
													}`
												);
										}}
										className={styles.chapter}
										key={'chapter-button-' + i}
									>
										Pasal {i + 1}
									</div>
								)
							)}
						</div>
					</div>
				</Drawer>

				<Modal
					// keepMounted
					open={showModal}
					container={containerRef.current}
					disablePortal
					disableEnforceFocus
					onClose={handleModal}
					style={{ position: 'absolute' }}
					slots={{
						backdrop: Backdrop,
					}}
					closeAfterTransition
					slotProps={{
						backdrop: {
							timeout: 500,
							sx: {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(0, 0, 0, 0.4)',
								zIndex: '10 !important',
							},
						},
					}}
				>
					<div
						style={{
							position: 'absolute', // Avoid full screen
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 'max-content',
							backgroundColor: 'var(--terBg)',
							zIndex: '99',
							borderRadius: '10px',
							outline: 'none',
						}}
					>
						<SearchBible
							onClose={handleModal}
							listBook={listBook}
						/>
					</div>
				</Modal>

				<Modal
					// keepMounted
					open={showPersonalData}
					container={containerPersonalDataRef.current}
					disablePortal
					disableEnforceFocus
					onClose={handleModalPersonalData}
					style={{ position: 'absolute' }}
					slots={{
						backdrop: Backdrop,
					}}
					closeAfterTransition
					slotProps={{
						backdrop: {
							timeout: 500,
							sx: {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(0, 0, 0, 0.4)',
								zIndex: '10 !important',
							},
						},
					}}
				>
					<div
						style={{
							position: 'absolute', // Avoid full screen
							top: '50%',
							left: '50%',
							width: '100%',
							height: '100%',
							transform: 'translate(-50%, -50%)',
							backgroundColor: 'var(--terBg)',
							zIndex: '99',
							outline: 'none',
							padding: '2rem',
						}}
					>
						<PersonalData
							onClose={handleModalPersonalData}
							session={session}
						/>
					</div>
				</Modal>

				{/* Using Dialog to test the fullscreen property */}
				<StyledDialog
					open={showCreateNoteDialog}
					onClose={handleShowCreateNoteDialog}
					container={containerRef.current}
					fullScreen
				>
					<DialogTitle>
						<div
							style={{
								width: '40px',
								cursor: 'pointer',
								margin: '1rem',
							}}
							onClick={handleShowCreateNoteDialog}
						>
							<img src="/close.png" />
						</div>
					</DialogTitle>
					<DialogContent dividers>
						<NoteDialogContent
							onClose={handleShowCreateNoteDialog}
							selectedVerse={selectedVerse}
							label={`${decodeURIComponent(
								book
							)} ${chapter} : ${renderVerses(selectedVerse)}`}
							session={session}
						/>
					</DialogContent>
				</StyledDialog>
			</div>
		</div>
	);
}

function renderVerses(verses: VerseEntry[]) {
	let orders: number[] = [];

	verses.map((verse) => {
		orders.push(verse.order);
	});

	const sorted = [...new Set(orders)].sort((a, b) => a - b);
	const result: string[] = [];

	let start = sorted[0];
	let end = sorted[0];

	for (let i = 1; i < sorted.length; i++) {
		const current = sorted[i];

		if (current === end + 1) {
			end = current;
		} else {
			result.push(start === end ? `${start}` : `${start} - ${end}`);
			start = current;
			end = current;
		}
	}

	result.push(start === end ? `${start}` : `${start} - ${end}`);

	return result.join(', ');
}

const bookNames: Record<number, string> = {
	1: 'Kejadian',
	2: 'Keluaran',
	3: 'Imamat',
	4: 'Bilangan',
	5: 'Ulangan',
	6: 'Yosua',
	7: 'Hakim-Hakim',
	8: 'Rut',
	9: '1 Samuel',
	10: '2 Samuel',
	11: '1 Raja-Raja',
	12: '2 Raja-Raja',
	13: '1 Tawarikh',
	14: '2 Tawarikh',
	15: 'Ezra',
	16: 'Nehemia',
	17: 'Ester',
	18: 'Ayub',
	19: 'Mazmur',
	20: 'Amsal',
	21: 'Pengkhotbah',
	22: 'Kidung Agung',
	23: 'Yesaya',
	24: 'Yeremia',
	25: 'Ratapan',
	26: 'Yehezkiel',
	27: 'Daniel',
	28: 'Hosea',
	29: 'Yoel',
	30: 'Amos',
	31: 'Obaja',
	32: 'Yunus',
	33: 'Mikha',
	34: 'Nahum',
	35: 'Habakuk',
	36: 'Zefanya',
	37: 'Hagai',
	38: 'Zakharia',
	39: 'Maleakhi',
	40: 'Matius',
	41: 'Markus',
	42: 'Lukas',
	43: 'Yohanes',
	44: 'Kisah Para Rasul',
	45: 'Roma',
	46: '1 Korintus',
	47: '2 Korintus',
	48: 'Galatia',
	49: 'Efesus',
	50: 'Filipi',
	51: 'Kolose',
	52: '1 Tesalonika',
	53: '2 Tesalonika',
	54: '1 Timotius',
	55: '2 Timotius',
	56: 'Titus',
	57: 'Filemon',
	58: 'Ibrani',
	59: 'Yakobus',
	60: '1 Petrus',
	61: '2 Petrus',
	62: '1 Yohanes',
	63: '2 Yohanes',
	64: '3 Yohanes',
	65: 'Yudas',
	66: 'Wahyu',
};

const bookNamesToNumber: Record<string, number> = Object.entries(
	bookNames
).reduce((acc, [num, name]) => {
	acc[name.toLowerCase()] = parseInt(num);
	return acc;
}, {} as Record<string, number>);

function getBookNumberFromUrl(book: string): number {
	return bookNamesToNumber[decodeURIComponent(book.toLowerCase())];
}
