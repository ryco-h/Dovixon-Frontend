import styles from './page.module.css';
import Feeds from '@/components/feeds/feeds';
import Releases from '@/components/releases/releases';

import BibleQuote from '@/components/bible.quote/bible.quote';

export default async function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<BibleQuote />

				<Feeds title={'articles'} />
				<Releases title={'Releases'} />
			</div>
		</div>
	);
}
