import * as File from './File'
import * as FileList from './FileList'
import { doShellScript } from '../helpers/shell'

export async function scan(path: string): Promise<FileList.Type> {
	const output: FileList.Type = []
	const consoleLogLines: string[] = await doShellScript('grep -ir "console\.log" ' + path)
	if (!consoleLogLines.length) return []
	for (const i of consoleLogLines) {
		const parts = i.split(/:/).map(e => e.trim())
		const found: File.Type | undefined = output.find((e) => e.path === parts[0])
		if (found) {
			found.log.count++
			found.log.details.push(parts[1] ?? '')
		} else {
			output.push({
				path: parts[0] ?? '',
				log: {
					count: 1,
					details: [parts[1] ?? ''],
				},
			})
		}
	}
	return output
}

export * as Scanner from './Scanner'
