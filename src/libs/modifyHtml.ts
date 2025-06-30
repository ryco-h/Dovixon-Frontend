import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import * as cheerio from 'cheerio';

export function modifyHTML(htmlString: string) {
	const window = new JSDOM('').window;
	const DOMPurify = createDOMPurify(window);

	const purifiedDom = DOMPurify.sanitize(htmlString);

	const $ = cheerio.load(purifiedDom);

	$('.buylink__item').each((_, el) => {
		const $item = $(el);
		const $first = $item.children().eq(0);
		const $second = $item.children().eq(1);

		const $wrapper = $('<div class="header_buy_link"></div>');

		$first.before($wrapper);
		$wrapper.append($first);
		$wrapper.append($second);
	});

	// $('.buylink__extra').wrap(
	// 	'<div class="buylink__wrapper"></div>'
	// );

	// $('.buylink__extra').after(
	// 	'<span class="buylink__expand_text">See more option</span>'
	// );

	$('.buylink__extra').remove();
	$('.buylink__expand_text').remove();

	$('.buylink__links').each((_, el) => {
		const $links = $(el);
		const links = $links.find('a');

		if (links.length > 1) {
			// Keep the first link visible
			links
				.slice(1)
				.wrapAll(
					'<div class="buylink__extra_links" style="display: none;"></div>'
				);

			// Add toggle button
			const toggleButton = `<button onclick="toggleBuyLinks(this)" class="buylink__toggle_button" type="button">See more options ▼</button>`;
			$links.prepend(toggleButton);
		}
	});

	return $.html();
}
