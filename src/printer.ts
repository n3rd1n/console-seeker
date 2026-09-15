import { ScanResult } from './types'

const Reset = '\x1b[0m'
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'
const FgBlue = '\x1b[34m'

export function print(result: ScanResult, json = false): void {
	if (json) {
		console.log(JSON.stringify(result, null, 2))
		return
	}

	printHuman(result)
}

export function printHuman(result: ScanResult): void {
	const color = result.count ? FgRed : FgGreen
	console.info(`${color}${result.count} ERROR(S):${Reset}`)

	for (const file of result.files) {
		if (!file.count) continue
		console.info(`${FgBlue}${file.path}${Reset}`)
		for (const match of file.matches) {
			console.info(`   ${match.line}: ${match.text}`)
		}
	}
}
