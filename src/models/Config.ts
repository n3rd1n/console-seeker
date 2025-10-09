import * as fs from 'fs'
import * as path from 'path'

const configFileName: string = 'console-seeker.config.json'

export type Type = {
	scanFolder?: string
	ignorePaths?: string[]
	extensions?: string[]
}

export function createDefault(): Type {
	return {
		scanFolder: 'src',
		ignorePaths: ['node_modules', 'dist', 'build', '.git'],
		extensions: ['.js', '.ts', '.jsx', '.tsx'],
	}
}

export function loadConfig(configPath: string = configFileName): Type {
	const fullPath = path.resolve(configPath)

	if (!fs.existsSync(fullPath)) {
		return createDefault()
	}

	try {
		const configContent = fs.readFileSync(fullPath, 'utf-8')
		const config: Type = JSON.parse(configContent)

		return {
			scanFolder: config.scanFolder || 'src',
			ignorePaths: config.ignorePaths || [
				'node_modules',
				'dist',
				'build',
				'.git',
			],
			extensions: config.extensions || ['.js', '.ts', '.jsx', '.tsx'],
		}
	} catch (error) {
		throw new Error(`Error loading configuration: ${error}`)
	}
}

export function createDefaultConfig(configPath: string = configFileName): void {
	fs.writeFileSync(configPath, JSON.stringify(createDefault(), null, 2))
	console.info(`Default configuration created: ${configPath}`)
}

export * as Config from './Config'
