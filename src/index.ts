import * as path from 'path'
import { loadConfig } from './config'
import { scan as scanFiles } from './scanner'
import { Config, ScanResult } from './types'

export type {
	Config,
	ConsoleMatch,
	FileMatch,
	PartialConfig,
	ScanResult,
} from './types'
export {
	createDefaultConfig,
	DEFAULT_CONFIG,
	loadConfig,
	resolveConfig,
} from './config'
export { findMatches } from './find'
export { print, printHuman } from './printer'

export type ScanApiOptions = {
	path?: string
	config?: Config
	configPath?: string
	cwd?: string
}

export async function scan(options: ScanApiOptions = {}): Promise<ScanResult> {
	const cwd = options.cwd ?? process.cwd()
	const config = options.config ?? loadConfig(options.configPath, cwd)
	const root = options.path ?? config.scanFolder

	return scanFiles({
		root: path.resolve(cwd, root),
		config,
		cwd,
	})
}
