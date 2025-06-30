import React, { Children, PropsWithChildren } from 'react';
import styles from './card.module.css';
import Link from 'next/link';

type CardProps = PropsWithChildren<{
	id?: string | undefined;
	image_url: string | undefined;
	form?: 'default' | 'long';
	title?: string | undefined;
	description?: string | undefined;
}>;

export default function Card({
	id,
	image_url,
	title,
	description,
	form,
	children,
	...props
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
	if (!image_url) return null;
	if (form == 'long')
		return (
			<div className={styles.containerLong}>
				<div className={styles.cardLong}>
					<img
						src={image_url}
						alt={image_url}
						style={{
							borderRadius: '10px',
							width: '300px',
							height: 'auto',
							objectFit: 'contain',
						}}
					/>
					<div className={styles.content}>
						<div className={styles.title}>{title}</div>
						<div className={styles.description}>{description}</div>

						<Link
							href={`/gamespot/${id}`}
							className={styles.readMore}
						>
							Read More
						</Link>
					</div>
				</div>
			</div>
		);
	return (
		<div className={styles.container} {...props}>
			<div className={styles.wrapper}>
				<div className={styles.card}>
					{/* <img src={image_url} alt="" /> */}
					<div className={styles.imageCover}>
						<img
							src={image_url}
							alt={image_url}
							style={{
								borderRadius: '10px',
								objectFit: 'contain',
								height: '200px',
							}}
						/>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}
