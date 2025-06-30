import React, { useEffect, useState } from 'react';
import styles from './detail.release.module.css';
import axios from 'axios';
import { GameInfo, ResponseProps } from '@/types/types';
import { Tooltip } from 'react-tooltip';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface DetailProps {
	GUID: string | undefined;
}

export default function DetailRelease(props: DetailProps) {
	const [isFetching, setFetching] = useState(false);
	const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

	const fetchGameInfo = async () => {
		setGameInfo(null);
		setFetching(true);
		if (props.GUID) {
			await axios
				.get(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						'/ReleaseDetail?query=' +
						encodeURIComponent(props.GUID),
					{
						onDownloadProgress: () => {
							setFetching(false);
						},
					}
				)
				.then((res) => {
					const data = res.data;
					setGameInfo(data.results as GameInfo);
				});
		}
	};

	useEffect(() => {
		fetchGameInfo();
	}, [props.GUID]);

	useEffect(() => {
		if (gameInfo != null) {
			const element = document.getElementById('game-detail');
			element?.scrollIntoView({ behavior: 'smooth' });
		}
	});

	console.log({ gameInfo });

	if (!props.GUID) return null;
	return (
		<div className={styles.container} id="game-detail">
			<div className={styles.wrapper}>
				<div className={styles.content}>
					{gameInfo != null ? (
						<>
							<div className={styles.detailHeader}>
								<img
									className={styles.banner}
									src={
										gameInfo?.image.original_url[
											'#cdata-section'
										]
									}
								/>

								<div className={styles.headerDescription}>
									<span className={styles.name}>
										{gameInfo?.name['#cdata-section']}
									</span>

									{gameInfo ? (
										<div
											style={{
												width: '100%',
												borderBottom: '1px solid white',
											}}
										/>
									) : null}

									<span className={styles.deck}>
										{gameInfo?.deck['#cdata-section']}
									</span>

									<div className={styles.information}>
										{Array.isArray(
											gameInfo?.developers.company
										) ? (
											gameInfo?.developers.company.map(
												(detail, index) => (
													<a
														key={
															detail.name[
																'#cdata-section'
															] + index
														}
														className={
															styles.company
														}
														href={
															detail
																.site_detail_url[
																'#cdata-section'
															]
														}
													>
														{
															detail.name[
																'#cdata-section'
															]
														}
													</a>
												)
											)
										) : (
											<a
												className={styles.company}
												href={
													gameInfo?.developers.company
														.site_detail_url[
														'#cdata-section'
													] || undefined
												}
											>
												{
													gameInfo?.developers.company
														.name['#cdata-section']
												}
											</a>
										)}
										•
										<div
											id="date-release"
											className={styles.date}
										>
											{gameInfo?.original_release_date
												? gameInfo
														?.original_release_date[
														'#cdata-section'
												  ]
												: 'No release date yet'}
										</div>
										<Tooltip
											style={{ fontSize: '14px' }}
											anchorSelect="#date-release"
											clickable
										>
											Date Release
										</Tooltip>
										•
										<div className={styles.platforms}>
											{Array.isArray(
												gameInfo?.platforms.platform
											) ? (
												gameInfo?.platforms.platform.map(
													(platform, index) => (
														<div
															key={
																platform.name[
																	'#cdata-section'
																] +
																' ' +
																index
															}
														>
															<div
																className={
																	styles.platform
																}
																id={
																	platform
																		.abbreviation[
																		'#cdata-section'
																	]
																}
															>
																{
																	platform
																		.abbreviation[
																		'#cdata-section'
																	]
																}
															</div>
															<Tooltip
																style={{
																	fontSize:
																		'14px',
																}}
																anchorSelect={`#${platform.abbreviation['#cdata-section']}`}
																clickable
															>
																{
																	platform
																		.name[
																		'#cdata-section'
																	]
																}
															</Tooltip>
														</div>
													)
												)
											) : (
												<>
													<div
														className={
															styles.platform
														}
														id={
															gameInfo.platforms
																.platform
																.abbreviation[
																'#cdata-section'
															]
														}
													>
														{
															gameInfo.platforms
																.platform
																.abbreviation[
																'#cdata-section'
															]
														}
													</div>
													<Tooltip
														style={{
															fontSize: '14px',
														}}
														anchorSelect={`#${gameInfo.platforms.platform.abbreviation['#cdata-section']}`}
														clickable
													>
														{
															gameInfo.platforms
																.platform.name[
																'#cdata-section'
															]
														}
													</Tooltip>
												</>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className={styles.detailContent}>
								<PhotoProvider>
									<div className={styles.gallery}>
										{Array.isArray(
											gameInfo.images.image
										) ? (
											gameInfo.images.image.map(
												(image, index) => (
													<PhotoView
														key={'image' + index}
														src={
															image.super_url[
																'#cdata-section'
															]
														}
													>
														<img
															src={
																image.super_url[
																	'#cdata-section'
																]
															}
															alt=""
															className={
																styles.galleryImage
															}
														/>
													</PhotoView>
												)
											)
										) : (
											<>
												<PhotoView
													key={'image-gallery'}
													src={
														gameInfo.images.image
															.super_url[
															'#cdata-section'
														]
													}
												>
													<img
														src={
															gameInfo.images
																.image
																.super_url[
																'#cdata-section'
															]
														}
														alt=""
														className={
															styles.galleryImage
														}
													/>
												</PhotoView>
											</>
										)}
									</div>
								</PhotoProvider>
							</div>
						</>
					) : null}
					{isFetching ? 'Loading...' : null}
				</div>
			</div>
		</div>
	);
}
