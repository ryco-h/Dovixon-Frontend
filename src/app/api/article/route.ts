import { modifyHTML } from '@/libs/modifyHtml';
import { ArticleProps, ResponseProps } from '@/types/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const branch = searchParams.get('branch');

	if (!branch || typeof branch !== 'string') {
		return NextResponse.json({
			error: 'Missing or invalid branch parameter',
		});
	}

	const today = new Date();
	const formattedDate = today.toISOString().split('T')[0];

	const params = encodeURIComponent(
		`limit=10&filter=publish_date:2025-01-01|${formattedDate},platform:94,id:${branch}&sort=publish_date:desc`
	);

	const response = await fetch(
		process.env.NEXT_PUBLIC_BACKEND_URL + '/Feeds?query=' + params
	);

	console.log(process.env.NEXT_PUBLIC_BACKEND_URL + '/Feeds?query=' + params);

	const data: ResponseProps = await response.json();
	var article: ArticleProps;

	if ('article' in data.results) {
		article = data.results.article as ArticleProps;
		article['body']['#cdata-section'] = modifyHTML(
			article.body['#cdata-section']
		);

		data.results.article = article;

		return NextResponse.json(data);
	}
}
