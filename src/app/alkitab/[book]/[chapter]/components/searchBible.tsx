import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import styles from './searchBible.module.css';
import { ListBook, VerseCount } from '@/types/types';
import { useRouter } from 'next/navigation';

interface SearchBibleProps {
	onClose: MouseEventHandler;
	listBook: ListBook[];
}

export default function SearchBible({ onClose, listBook }: SearchBibleProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedBook, setSelectedBook] = useState<String>('');
	const [chapters, setChapters] = useState<VerseCount[]>([]);
	const [usedListBook, setUsedListBook] = useState<ListBook[]>(listBook);

	const handleBook = (bookString: String) => {
		setSelectedBook(bookString);
		if (bookString != '') {
			usedListBook?.map((book) => {
				if (book.bookName == bookString) {
					setChapters(book.chapters);
				}
			});
		} else {
			setUsedListBook(listBook);
		}
	};

	const debouncedSearch = useDebouncedCallback(() => {
		const value = inputRef.current?.value.trim() || '';
		if (value != '') {
			setUsedListBook(
				listBook.filter((book) => {
					if (book.bookName.toLowerCase().includes(value))
						return book;
				})
			);
		} else {
			setUsedListBook(listBook);
		}
	}, 500);

	const navigate = useRouter();

	const navigateChapter = (selectedBook: String, chapter: Number) => {
		if (selectedBook && chapter)
			navigate.replace(
				`/alkitab/${selectedBook.toLowerCase()}/${chapter}`
			);
	};

	if (!listBook && Array(listBook).length == 0) return null;
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.closeButton} onClick={onClose}>
					<img src="/close.png" />
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.leftContent}>
					<input
						placeholder="Cari kitab..."
						className={styles.searchInput}
						ref={inputRef}
						onChange={debouncedSearch}
					/>
					{usedListBook.map((book, index) => (
						<div
							key={'search book-' + book.bookName}
							className={styles.book}
							onClick={() => handleBook(book.bookName)}
							style={{
								background:
									selectedBook == book.bookName
										? 'var(--bg)'
										: '',
							}}
						>
							{book.bookName}
						</div>
					))}
				</div>
				<div className={styles.rightContent}>
					{selectedBook != '' ? (
						chapters.map((chapter) => (
							<div
								key={'chapter-' + chapter.chapterNumber}
								className={styles.chapter}
								onClick={() =>
									navigateChapter(
										selectedBook,
										chapter.chapterNumber
									)
								}
							>
								{Number(chapter.chapterNumber)}
							</div>
						))
					) : (
						<span
							style={{
								height: '400px',
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							Pilih kitab...
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

function useDebouncedCallback(callback: () => void, delay: number) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const trigger = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(callback, delay);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return trigger;
}
