import {
	ArticleProps,
	ArticlesProps,
	ReleaseInfo,
	VerseInterface,
} from '@/types/types';

export const emptyFeedCard: ArticlesProps = {
	article: [],
};

export const emptyArticle: ArticleProps = {
	id: '',
	publish_date: '',
	update_date: '',
	authors: {
		'#cdata-section': '',
	},
	title: { '#cdata-section': '' },
	deck: { '#cdata-section': '' },
	lede: { '#cdata-section': '' },
	body: { '#cdata-section': '' },
	image: {
		square_tiny: { '#cdata-section': '' },
		screen_tiny: { '#cdata-section': '' },
		square_small: { '#cdata-section': '' },
		original: { '#cdata-section': '' },
	},
	categories: { '#cdata-section': '' },
	associations: {
		api_detail_url: { '#cdata-section': '' },
		guid: { '#cdata-section': '' },
		id: '',
		name: [],
	},
	site_detail_url: { '#cdata-section': '' },
};

export const emptyReleaseInfoCard: ReleaseInfo[] = [
	{
		api_detail_url: '',
		date_added: '',
		date_last_updated: '',
		deck: null,
		description: '',
		expected_release_day: null,
		expected_release_month: null,
		expected_release_quarter: null,
		expected_release_year: null,
		game: {
			api_detail_url: '',
			id: 0,
			name: '',
		},
		game_rating: null,
		guid: '',
		id: 0,
		image: {
			icon_url: '',
			medium_url: '',
			screen_url: '',
			screen_large_url: '',
			small_url: '',
			super_url: '',
			thumb_url: '',
			tiny_url: '',
			original_url: '',
			image_tags: '',
		},
		maximum_players: null,
		minimum_players: null,
		name: '',
		platform: {
			api_detail_url: '',
			id: 0,
			name: '',
		},
		product_code_type: null,
		product_code_value: null,
		region: {
			api_detail_url: '',
			id: 0,
			name: '',
		},
		release_date: null,
		site_detail_url: '',
		widescreen_support: 0,
	},
];

export const emptyVerses: VerseInterface[] = [
	{
		id: undefined,
		wordId: undefined,
		word: undefined,
		bookNum: undefined,
		chapterNum: undefined,
		verseNum: undefined,
	},
];

// import { CardProperty } from '@/types';

// export const emptyCard: CardProperty = {
// 	error: {},
// 	limit: '',
// 	offset: '',
// 	number_of_page_results: '',
// 	number_of_total_results: '',
// 	status_code: '',
// 	results: {
// 		article: [
// 			{
// 				id: '',
// 				publish_date: '',
// 				update_date: '',
// 				authors: {
// 					'#cdata-section': '',
// 				},
// 				title: { '#cdata-section': '' },
// 				deck: { '#cdata-section': '' },
// 				lede: { '#cdata-section': '' },
// 				body: { '#cdata-section': '' },
// 				image: {
// 					square_tiny: { '#cdata-section': undefined },
// 					screen_tiny: { '#cdata-section': undefined },
// 					square_small: { '#cdata-section': undefined },
// 					original: { '#cdata-section': undefined },
// 				},
// 				categories: { '#cdata-section': '' },
// 				associations: [],
// 				site_detail_url: { '#cdata-section': '' },
// 			},
// 		],
// 	},
// 	version: '',
// };
