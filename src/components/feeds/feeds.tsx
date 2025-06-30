'use client';

import React, { useEffect, useState } from 'react';
import styles from './feeds.module.css';
import Card from '../card/card';
import { ArticlesProps, FeedProps, ResponseProps } from '@/types/types';
import { emptyFeedCard } from '../../properties';
import { Tooltip } from 'react-tooltip';

export default function Feeds({ title }: FeedProps) {
	const [feeds, setFeeds] = useState<ArticlesProps>(emptyFeedCard);
	const fetchFeeds = async () => {
		const today = new Date();
		const formattedDate = today.toISOString().split('T')[0];
		const params = encodeURIComponent(
			`limit=10&filter=publish_date:2025-01-01|${formattedDate},platform:94&sort=publish_date:desc`
		);

		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND_URL + '/Feeds?query=' + params
			);

			const data: ResponseProps = await response.json();
			if ('article' in data.results) {
				setFeeds(data.results as ArticlesProps);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchFeeds();
	}, []);

	if (!feeds) return null;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.title} id="feeds-title">
					{title}
				</div>
				<Tooltip
					style={{ fontSize: '14px' }}
					anchorSelect="#feeds-title"
					clickable
				>
					https://www.gamespot.com/api/articles/
				</Tooltip>
				<div className={styles.cards}>
					{feeds.article.map((article) => (
						<Card
							id={article.id}
							image_url={article.image.original['#cdata-section']}
							key={article.id}
							title={article.title['#cdata-section']}
							description={article.deck['#cdata-section']}
							form="long"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
