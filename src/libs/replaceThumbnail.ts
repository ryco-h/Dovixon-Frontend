export function replaceThumbnailsWithFullSize(htmlString: string) {
	if (typeof window === 'undefined') {
		return htmlString;
	}
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');

	const figure = doc.querySelector('figure[data-embed-type="gallery"]');
	if (!figure) return htmlString;

	const fullImageUrls = figure.getAttribute('data-img-src')?.split(',') ?? [];

	const thumbnails = figure.querySelectorAll('img');

	thumbnails.forEach((img, index) => {
		if (fullImageUrls[index]) {
			img.setAttribute('src', fullImageUrls[index].trim());
		}
	});

	return doc.body.innerHTML;
}
