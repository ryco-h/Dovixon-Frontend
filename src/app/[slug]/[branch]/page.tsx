'use client';

import { emptyArticle } from '@/properties';
import { ArticleProps, ResponseProps } from '@/types/types';
import { use, useEffect, useState } from 'react';
import './page.css';
import styles from './page.module.css';
import Script from 'next/script';
import { replaceThumbnailsWithFullSize } from '@/libs/replaceThumbnail';
import { formatDate } from '@/libs/formatDate';
import Spinner from '@/components/spinner/spinner';
// import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
	interface Window {
		twttr: {
			widgets: {
				load: (element?: HTMLElement) => void;
			};
		};
	}
}

export default function SinglePage({
	params,
}: {
	params: Promise<{ slug: string; branch: string }>;
}) {
	const { slug, branch } = use(params);
	const [feeds, setFeeds] = useState<ArticleProps>(emptyArticle);

	const fetchFeeds = async () => {
		try {
			const response = await fetch(
				`/api/article?branch=${encodeURIComponent(branch)}`
			);

			const data: ResponseProps = await response.json();

			if ('article' in data.results) {
				setFeeds(data.results.article as ArticleProps);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchFeeds();
	}, []);

	const [cleanHtml, setCleanHtml] = useState('');

	useEffect(() => {
		setCleanHtml(feeds.body['#cdata-section']);
	}, [feeds.body]);

	useEffect(() => {
		const tryRenderTwitter = () => {
			if (
				window.twttr &&
				window.twttr.widgets &&
				typeof window.twttr.widgets.load === 'function'
			) {
				window.twttr.widgets.load();
			}
		};

		// Delay slightly to ensure DOM is updated
		setTimeout(tryRenderTwitter, 0);
	}, []);

	if ((!feeds && !cleanHtml) || cleanHtml == '')
		return <Spinner message="Loading content" />;

	return (
		<div className={styles.container}>
			<div
				style={{
					position: 'relative',
					height: '100%',
				}}
			>
				<div className={styles.backgroundContainer}>
					{feeds.image?.original['#cdata-section'] ? (
						<img
							src={feeds.image.original['#cdata-section']}
							alt="Background"
							className={styles.blurredBackground}
						/>
					) : null}
				</div>
				{feeds.title['#cdata-section'] ? (
					<div className={styles.headerContent}>
						{feeds.image.square_small['#cdata-section'] ? (
							<img
								src={feeds.image.square_small['#cdata-section']}
								alt={feeds.image.square_small['#cdata-section']}
								style={{
									borderRadius: '10px',
									width: '200px',
									height: 'auto',
									objectFit: 'contain',
								}}
							/>
						) : null}

						<div className={styles.headerDetail}>
							<div className={styles.title}>
								{feeds.title['#cdata-section']}
							</div>

							<div className={styles.publisher}>
								<div className={styles.author}>
									{feeds.authors['#cdata-section']}
								</div>
								•
								<div className={styles.date}>
									{formatDate(feeds.publish_date)}
								</div>
							</div>

							<div className={styles.associations}>
								{feeds.associations &&
								Array.isArray(feeds.associations.name) ? (
									feeds.associations.name.map(
										(association: any, index: any) => (
											<div
												key={
													association[
														'#cdata-section'
													] +
													'-' +
													index
												}
												className={styles.association}
											>
												{association['#cdata-section']}
											</div>
										)
									)
								) : (
									<div
										key={
											!Array.isArray(
												feeds.associations.name
											)
												? feeds.associations.name[
														'#cdata-section'
												  ]
												: ''
										}
										className={styles.association}
									>
										{!Array.isArray(feeds.associations.name)
											? feeds.associations.name[
													'#cdata-section'
											  ]
											: null}
									</div>
								)}
							</div>
						</div>
					</div>
				) : null}
			</div>
			<div
				style={{
					margin: 'auto auto 5vw auto',
					paddingLeft: '10vw',
					paddingRight: '10vw',
				}}
				dangerouslySetInnerHTML={{
					__html: replaceThumbnailsWithFullSize(cleanHtml),
				}}
			/>
			<Script
				src="https://platform.twitter.com/widgets.js"
				async
				strategy="afterInteractive"
			/>
			<Script id="toggle-buy-links" strategy="afterInteractive">
				{`
				function toggleBuyLinks(button) {
					const container = button.closest('.buylink__links');
					const extraLinks = container.querySelector('.buylink__extra_links');
					if (extraLinks) {
						const isShown = extraLinks.style.display === 'flex';
						extraLinks.style.display = isShown ? 'none' : 'flex';
						extraLinks.style['flexDirection'] = 'column';
						extraLinks.style.gap = '.5rem';
						button.textContent = isShown ? 'See more options ▼' : 'See fewer options ▲';
					}
				}
				`}
			</Script>
		</div>
	);
}
