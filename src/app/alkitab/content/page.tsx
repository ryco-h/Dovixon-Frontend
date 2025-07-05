'use client';

import { VerseInterface } from '@/types/types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

type RSSItem = {
	title: string;
	link: string;
	pubDate: string;
	content: string;
	contentSnippet: string;
	enclosure?: {
		url: string;
	};
	creator?: string;
};

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

export default function AlkitabContent() {
	const { data: session } = useSession();

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

	// RSS Section
	const [christianityFeed, setChristianityFeed] = useState<{} | RSSItem>();
	const fetchChristianityFeed = async () => {
		await fetch('/api/rss/christianity')
			.then((res) => res.json())
			.then((data) => setChristianityFeed(data));
	};

	console.log({ christianityFeed });

	useEffect(() => {
		fetchBookmarks();
		fetchNotes();
		fetchChristianityFeed();
	}, []);

	return <div>AlkitabContent</div>;
}
