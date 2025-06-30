'use client';

import React, { useEffect, useState } from 'react';
import styles from './quote.module.css';
import { Tooltip } from 'react-tooltip';

// {
// 	_id: '6S4ONaVMZU',
// 	author: 'Aesop',
// 	content: 'Be content with your lot; one cannot be first in everything.',
// 	tags: ['Wisdom'],
// 	authorSlug: 'aesop',
// 	length: 60,
// 	dateAdded: '2023-04-03',
// 	dateModified: '2023-04-14',
// }

export default function Quote() {
	const [quote, setQuote] = useState({
		_id: '',
		author: '',
		content: '',
		tags: [''],
		authorSlug: '',
		length: 0,
		dateAdded: '',
		dateModified: '',
	});

	const fetchQuote = async () => {
		setQuote({
			_id: '',
			author: '',
			content: '',
			tags: [''],
			authorSlug: '',
			length: 0,
			dateAdded: '',
			dateModified: '',
		});

		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND_URL + '/RandomQuote'
			);

			const data = await response.json();
			setQuote(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchQuote();
	}, []);

	if (!quote) return null;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.quote}>
					{quote.content !== '' ? (
						// https://codepen.io/catalinred/pen/YzBPadm -> Blockquote CSS
						<blockquote className={styles.blockquote}>
							<p>{quote.content}</p>
							<div className={styles.source}>
								<div className={styles.author}>
									- {quote.author}
								</div>

								<div
									className={styles.sourceIcon}
									id="quote-api"
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
									anchorSelect="#quote-api"
									clickable
								>
									https://api.quotable.io/random
								</Tooltip>

								<div
									onClick={fetchQuote}
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
									Try another quote
								</Tooltip>
							</div>
						</blockquote>
					) : (
						<div className={styles.content}>
							Searching quote for you...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
