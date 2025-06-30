import { Key } from 'react';

export interface FeedProps {
	title: string;
}

type CDataString = {
	'#cdata-section': string | '';
};

export interface ResponseProps {
	error: object;
	limit: string;
	offset: string;
	number_of_page_results: string;
	number_of_total_results: string;
	status_code: string;
	results: object;
	version: string;
}

export interface ArticlesProps {
	article: ArticleProps[];
}

export interface ArticleProps {
	id: string;
	publish_date: string;
	update_date: string;
	authors: CDataString;
	title: CDataString;
	deck: CDataString;
	lede: CDataString;
	body: CDataString;
	image: ImageProps;
	categories: CDataString;
	associations: Associations;
	site_detail_url: CDataString;
}

export interface ImageProps {
	square_tiny: CDataString;
	screen_tiny: CDataString;
	square_small: CDataString;
	original: CDataString;
}

export interface Associations {
	id: string;
	name: CDataString | CDataString[];
	api_detail_url: CDataString;
	guid: CDataString;
}

export interface ReleaseInfo {
	api_detail_url: string;
	date_added: string;
	date_last_updated: string;
	deck: string | null;
	description: string;
	expected_release_day: number | null;
	expected_release_month: number | null;
	expected_release_quarter: number | null;
	expected_release_year: number | null;
	game: {
		api_detail_url: string;
		id: number;
		name: string;
	};
	game_rating: any; // Replace with more specific type if known
	guid: string;
	id: number;
	image: {
		icon_url: string;
		medium_url: string;
		screen_url: string;
		screen_large_url: string;
		small_url: string;
		super_url: string;
		thumb_url: string;
		tiny_url: string;
		original_url: string;
		image_tags: string;
	};
	maximum_players: number | null;
	minimum_players: number | null;
	name: string;
	platform: {
		api_detail_url: string;
		id: number;
		name: string;
	};
	product_code_type: string | null;
	product_code_value: string | null;
	region: {
		api_detail_url: string;
		id: number;
		name: string;
	};
	release_date: string | null;
	site_detail_url: string;
	widescreen_support: number;
}

export interface GameInfo {
	aliases: CDataString;
	api_detail_url: CDataString;
	characters: any[] | null;
	concepts: object | null; // To Be Added Soon
	date_added: string;
	date_last_updated: string;
	deck: CDataString;
	description: CDataString | null;
	developers: DeveloperInfo;
	expected_release_day: CDataString | null;
	expected_release_month: CDataString | null;
	expected_release_quarter: CDataString | null;
	expected_release_year: CDataString | null;
	first_appearance_characters: any[];
	first_appearance_concepts: any[];
	first_appearance_locations: any[];
	first_appearance_objects: any[];
	first_appearance_people: any[];
	franchises: any[];
	genres: any[];
	guid: CDataString;
	id: string;
	image: GameInfoImage;
	images: Images;
	image_tags: object;
	killed_characters: any[];
	locations: any[];
	name: CDataString;
	number_of_user_reviews: string;
	objects: any[];
	original_game_rating: any[];
	original_release_date: CDataString | null;
	people: any[];
	platforms: Platforms; // To Be Added Soon
	publishers: any[];
	releases: any[];
	dlcs: any[];
	reviews: any[];
	similar_games: any[];
	site_detail_url: CDataString;
	themes: any[];
	videos: any[] | null;
}

// Last Check Developers
interface Images {
	image: GameInfoImage[] | GameInfoImage;
}

interface GameInfoImage {
	icon_url: CDataString;
	medium_url: CDataString;
	screen_url: CDataString;
	screen_large_url: CDataString;
	small_url: CDataString;
	super_url: CDataString;
	thumb_url: CDataString;
	tiny_url: CDataString;
	original_url: CDataString;
	image_tags: CDataString;
}

interface DeveloperInfo {
	company: CompanyInfo;
}

interface CompanyInfo {
	api_detail_url: CDataString;
	id: string;
	name: CDataString;
	site_detail_url: CDataString;
}

interface Platforms {
	platform: Platform[] | Platform;
}

interface Platform {
	abbreviation: CDataString;
	api_detail_url: CDataString;
	id: string;
	name: CDataString;
	site_detail_url: CDataString;
}

export interface ListBook {
	bookName: String;
	chaptersCount: Number;
	chapters: VerseCount[];
}

export interface VerseCount {
	chapterNumber: Number;
	versesCount: Number;
}

export interface Book {
	id: String;
	bookName: String;
	bookNum: Number;
	chapters: ChapterInterface[];
	verses: VerseInterface[];
}

export interface ChapterInterface {
	chapterNumber: Number;
	firstVerse: Number;
	lastVerse: Number;
	verses: Number[];
}

export interface VerseInterface {
	id: Key | null | undefined;
	bookNum: Number | undefined;
	chapterNum: Number | undefined;
	verseNum: Number | undefined;
	word: String | undefined;
	wordId: Number | undefined;
}

export type VerseEntry = {
	verse: string;
	order: number;
	detail: VerseInterface;
};

export interface GoogleIdTokenPayload {
	at_hash: string;
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name: string;
	given_name: string;
	iat: number;
	iss: string;
	name: string;
	picture: string;
	sub: string; // This is the unique user ID (aka `userId`)
}
