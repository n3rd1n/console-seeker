import * as FileList from './FileList'
import * as File from './File'

const Reset = '\x1b[0m'
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'
const FgBlue = '\x1b[34m'

export function print(files: FileList.Type): void {
	const amountOfProblems: number = getAmountOfProblems(files)
	if (amountOfProblems) {
		console.info(FgRed + amountOfProblems + ' ERROR(S):' + Reset)
	} else {
		console.info(FgGreen + amountOfProblems + ' ERROR(S):' + Reset)
	}
	for (const file of files) {
		if (!file.log.count) continue
		console.info(FgBlue + file.path + Reset)
		for (const detail of file.log.details) {
			console.info('   ' + detail)
		}
	}
	if (amountOfProblems) process.exit(1)
}

export function getAmountOfProblems(files: FileList.Type): number {
	return files.reduce((total: number, currentValue: File.Type) => {
		return total + currentValue.log.count
	}, 0)
}

export * as Printer from './Printer'
