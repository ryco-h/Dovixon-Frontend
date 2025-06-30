'use client';

import React, { useEffect, useState } from 'react';
import styles from './verse.module.css';
import { Tooltip } from 'react-tooltip';

export default function Verse() {
	const [verse, setVerse] = useState({
		book: '',
		author: '',
		chapter: '',
		pk: '',
		text: '',
		verse: '',
	});

	const fetchVerse = async () => {
		setVerse({
			book: '',
			author: '',
			chapter: '',
			pk: '',
			text: '',
			verse: '',
		});

		try {
			const response = await fetch(
				'https://bolls.life/get-random-verse/TB/'
			);

			const verse = await response.json();
			setVerse(verse);
			console.log({ verse });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchVerse();
	}, []);

	if (!verse) return null;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.verse}>
					{verse.text !== '' ? (
						// https://codepen.io/catalinred/pen/YzBPadm -> Blockquote CSS
						<blockquote className={styles.blockquote}>
							<p>{verse.text}</p>
							<div className={styles.source}>
								<div className={styles.author}>
									- {BIBLE_BOOKS_ID[parseInt(verse.book)]}{' '}
									{verse.chapter} : {verse.verse}
								</div>

								<div
									className={styles.sourceIcon}
									id="verse-api"
								>
									<img
										src={'/source.png'}
										width={20}
										height={20}
										alt="source"
									/>
								</div>
								<Tooltip
									style={{ fontSize: '14px' }}
									anchorSelect="#verse-api"
									clickable
								>
									https://bolls.life/get-random-verse/TB/
								</Tooltip>

								<div
									onClick={fetchVerse}
									className={styles.sourceIcon}
									id="reload"
								>
									<img
										src={'/reload.png'}
										width={20}
										height={20}
										alt="reload"
									/>
								</div>
								<Tooltip
									style={{ fontSize: '14px' }}
									anchorSelect="#reload"
									clickable
								>
									Read another verse
								</Tooltip>
							</div>
						</blockquote>
					) : (
						<div className={styles.content}>
							Searching verse for you...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

const BIBLE_BOOKS_ID = [
	// Perjanjian Lama (Old Testament)
	'Kejadian',
	'Keluaran',
	'Imamat',
	'Bilangan',
	'Ulangan',
	'Yosua',
	'Hakim-Hakim',
	'Rut',
	'1 Samuel',
	'2 Samuel',
	'1 Raja-Raja',
	'2 Raja-Raja',
	'1 Tawarikh',
	'2 Tawarikh',
	'Ezra',
	'Nehemia',
	'Ester',
	'Ayub',
	'Mazmur',
	'Amsal',
	'Pengkhotbah',
	'Kidung Agung',
	'Yesaya',
	'Yeremia',
	'Ratapan',
	'Yehezkiel',
	'Daniel',
	'Hosea',
	'Yoel',
	'Amos',
	'Obaja',
	'Yunus',
	'Mikha',
	'Nahum',
	'Habakuk',
	'Zefanya',
	'Hagai',
	'Zakharia',
	'Maleakhi',

	// Perjanjian Baru (New Testament)
	'Matius',
	'Markus',
	'Lukas',
	'Yohanes',
	'Kisah Para Rasul',
	'Roma',
	'1 Korintus',
	'2 Korintus',
	'Galatia',
	'Efesus',
	'Filipi',
	'Kolose',
	'1 Tesalonika',
	'2 Tesalonika',
	'1 Timotius',
	'2 Timotius',
	'Titus',
	'Filemon',
	'Ibrani',
	'Yakobus',
	'1 Petrus',
	'2 Petrus',
	'1 Yohanes',
	'2 Yohanes',
	'3 Yohanes',
	'Yudas',
	'Wahyu',
] as const;
