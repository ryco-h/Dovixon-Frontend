'use client';

import React, { useEffect, useState } from 'react';
import styles from './releases.module.css';
import { FeedProps, ReleaseInfo, ResponseProps } from '@/types/types';
import { emptyReleaseInfoCard } from '../../properties';
import Card from '../card/card';
import DetailRelease from './detail.release';
import { Tooltip } from 'react-tooltip';

export default function Releases({ title }: FeedProps) {
	const [releases, setReleases] =
		useState<ReleaseInfo[]>(emptyReleaseInfoCard);
	const fetchReleases = async () => {
		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND_URL + '/Releases'
			);

			const data: ResponseProps = await response.json();
			setReleases(data.results as ReleaseInfo[]);
			console.log({ release: data });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchReleases();
	}, []);

	const [selectedGUID, setGUID] = useState<string>();

	if (!releases) return null;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.title} id="release-title">
					{title}
				</div>
				<Tooltip
					style={{ fontSize: '14px' }}
					anchorSelect="#release-title"
					clickable
				>
					https://www.giantbomb.com/api/release/
				</Tooltip>
				<div className={styles.cards}>
					{releases.map((release) => (
						<Card
							image_url={release.image.original_url}
							key={release.id}
							onClick={() => {
								setGUID(release.game.api_detail_url);
							}}
						>
							<div>{release.name}</div>
						</Card>
					))}
				</div>
			</div>

			<DetailRelease GUID={selectedGUID} />
		</div>
	);
}
