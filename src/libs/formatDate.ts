export const formatDate = (originalDate: string) => {
	const date = new Date(originalDate);
	const formatted = date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
	return formatted;
};
