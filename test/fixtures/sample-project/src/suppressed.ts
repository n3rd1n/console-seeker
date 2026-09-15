export function demo(): void {
	// eslint-disable-next-line no-console
	console.log('next-line suppressed')

	console.log('inline suppressed') // eslint-disable-line no-console

	// console-seeker-ignore
	console.log('seeker ignore')
}
