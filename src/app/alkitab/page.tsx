'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import styles from './alkitab.module.css';
import Spinner from '@/components/spinner/spinner';
import { useSession } from 'next-auth/react';

export default function Alkitab() {
	const router = useRouter();
	const { data: session } = useSession();

	// useEffect(() => {
	// 	router.push('/alkitab/kejadian/1');
	// }, [router]);

	// return <Spinner />;
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{session?.mongoDb.id ? (
					<div
						className={styles.card}
						onClick={() => {
							router.push('/alkitab/content');
						}}
					>
						<div className={styles.title}>Halaman Pengguna</div>
						<div className={styles.description}>
							Lihat ayat-ayat tersimpan dan lainnya!
						</div>
					</div>
				) : null}
				<div
					className={styles.card}
					onClick={() => {
						router.push('/alkitab/kejadian/1');
					}}
				>
					<div className={styles.title}>Alkitab</div>
					<div className={styles.description}>
						Baca dan pelajari Alkitab!
					</div>
				</div>
			</div>
		</div>
	);
}
