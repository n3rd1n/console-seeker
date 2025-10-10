import * as Scanner from './Scanner'
import * as Printer from './Printer'
import * as FileList from './FileList'

export async function scan(): Promise<void> {
	const output: FileList.Type = await Scanner.scan('.')
	Printer.print(output)
}

export * as Main from './Main'
