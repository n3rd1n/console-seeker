import * as fs from 'fs/promises'
import * as path from 'path'
import { Config, FileMatch, ScanResult } from './types'
import { findMatches } from './find'

export type ScanOptions = {
	root: string
	config: Config
	cwd?: string
}

export async function scan(options: ScanOptions): Promise<ScanResult> {
	const cwd = options.cwd ?? process.cwd()
	const root = path.resolve(cwd, options.root)
	const files = await collectFiles(root, options.config)
	const fileMatches: FileMatch[] = []

	for (const file of files) {
		const content = await fs.readFile(file, 'utf8')
		const matches = findMatches(content, options.config.methods)
		if (!matches.length) continue

		fileMatches.push({
			path: toDisplayPath(file, cwd),
			count: matches.length,
			matches,
		})
	}

	fileMatches.sort((a, b) => a.path.localeCompare(b.path))

	return {
		count: fileMatches.reduce((sum, file) => sum + file.count, 0),
		files: fileMatches,
	}
}

async function collectFiles(root: string, config: Config): Promise<string[]> {
	let stats
	try {
		stats = await fs.stat(root)
	} catch {
		throw new Error(`Scan folder does not exist: ${root}`)
	}

	if (stats.isFile()) {
		return hasExtension(root, config.extensions) ? [root] : []
	}

	return walk(root, root, config)
}

async function walk(
	dir: string,
	root: string,
	config: Config,
): Promise<string[]> {
	let entries
	try {
		entries = await fs.readdir(dir, { withFileTypes: true })
	} catch {
		return []
	}

	const files: string[] = []

	for (const entry of entries) {
		if (entry.isSymbolicLink()) continue

		const fullPath = path.join(dir, entry.name)
		if (isIgnored(fullPath, root, config.ignorePaths)) continue

		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath, root, config)))
			continue
		}

		if (entry.isFile() && hasExtension(entry.name, config.extensions)) {
			files.push(fullPath)
		}
	}

	return files
}

export function isIgnored(
	fullPath: string,
	root: string,
	ignorePaths: string[],
): boolean {
	const relative = path.relative(root, fullPath).replace(/\\/g, '/')
	if (relative.startsWith('..')) return false

	return ignorePaths.some((ignore) => {
		const normalized = ignore.replace(/\\/g, '/').replace(/\/+$/, '')
		if (!normalized) return false
		if (relative === normalized || relative.startsWith(normalized + '/')) {
			return true
		}
		return relative.split('/').includes(normalized)
	})
}

function hasExtension(filePath: string, extensions: string[]): boolean {
	const lower = filePath.toLowerCase()
	return extensions.some((ext) => lower.endsWith(ext.toLowerCase()))
}

function toDisplayPath(file: string, cwd: string): string {
	const relative = path.relative(cwd, file)
	if (!relative || relative.startsWith('..')) {
		return file.replace(/\\/g, '/')
	}
	return relative.replace(/\\/g, '/')
}
