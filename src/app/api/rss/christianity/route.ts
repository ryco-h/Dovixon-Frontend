import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type RSSItem = {
	title: string;
	link: string;
	pubDate: string;
	contentSnippet?: string;
	enclosure?: { url: string };
	'a10:author'?: { 'a10:name'?: string };
};

const parser = new Parser({
	customFields: {
		item: [
			['a10:author', 'a10Author'], // pull <a10:author> into `a10Author`
		],
	},
});

export async function GET() {
	try {
		const feed = await parser.parseURL('https://www.christianity.com/rss/');
		const articles = feed.items.map((item) => {
			const rawAuthor = item['a10Author'] as any;

			const author =
				typeof rawAuthor === 'object' && 'a10:name' in rawAuthor
					? rawAuthor['a10:name'][0]
					: 'Unknown';

			return {
				title: item.title,
				link: item.link,
				pubDate: item.pubDate,
				description: item.contentSnippet || '',
				image: item.enclosure?.url || '',
				author,
			};
		});

		return NextResponse.json(articles);
	} catch (err) {
		console.error('Failed to fetch RSS:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch feed' },
			{ status: 500 }
		);
	}
}
