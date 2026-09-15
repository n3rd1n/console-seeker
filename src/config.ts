import * as fs from 'fs'
import * as path from 'path'
import { Config, PartialConfig } from './types'

export const CONFIG_FILE_NAME = 'console-seeker.config.json'

export const DEFAULT_CONFIG: Config = {
	scanFolder: 'src',
	ignorePaths: ['node_modules', 'dist', 'build', '.git', 'coverage'],
	extensions: ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.mts', '.cts'],
	methods: ['log'],
}

export function resolveConfig(partial: PartialConfig = {}): Config {
	return {
		scanFolder: partial.scanFolder ?? DEFAULT_CONFIG.scanFolder,
		ignorePaths: partial.ignorePaths ?? DEFAULT_CONFIG.ignorePaths,
		extensions: partial.extensions ?? DEFAULT_CONFIG.extensions,
		methods: partial.methods ?? DEFAULT_CONFIG.methods,
	}
}

export function loadConfig(
	configPath: string = CONFIG_FILE_NAME,
	cwd: string = process.cwd(),
): Config {
	const fullPath = path.resolve(cwd, configPath)

	if (!fs.existsSync(fullPath)) {
		return resolveConfig()
	}

	try {
		const configContent = fs.readFileSync(fullPath, 'utf-8')
		const parsed: PartialConfig = JSON.parse(configContent)
		return resolveConfig(parsed)
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		throw new Error(`Error loading configuration: ${message}`)
	}
}

export function createDefaultConfig(
	configPath: string = CONFIG_FILE_NAME,
	cwd: string = process.cwd(),
): string {
	const fullPath = path.resolve(cwd, configPath)
	fs.writeFileSync(fullPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n')
	return fullPath
}
