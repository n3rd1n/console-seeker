import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import {
	createDefaultConfig,
	DEFAULT_CONFIG,
	loadConfig,
	resolveConfig,
} from '../src/config'

const tempDirs: string[] = []

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		fs.rmSync(dir, { recursive: true, force: true })
	}
})

function makeTempDir(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'console-seeker-'))
	tempDirs.push(dir)
	return dir
}

describe('resolveConfig', () => {
	it('fills in defaults', () => {
		expect(resolveConfig({})).toEqual(DEFAULT_CONFIG)
	})

	it('keeps empty ignore lists instead of replacing them', () => {
		expect(resolveConfig({ ignorePaths: [] }).ignorePaths).toEqual([])
	})
})

describe('loadConfig', () => {
	it('returns defaults when the file is missing', () => {
		const cwd = makeTempDir()
		expect(loadConfig('console-seeker.config.json', cwd)).toEqual(
			DEFAULT_CONFIG,
		)
	})

	it('merges a config file with defaults', () => {
		const cwd = makeTempDir()
		fs.writeFileSync(
			path.join(cwd, 'console-seeker.config.json'),
			JSON.stringify({
				scanFolder: 'app',
				methods: ['log', 'debug'],
			}),
		)

		expect(loadConfig('console-seeker.config.json', cwd)).toEqual({
			...DEFAULT_CONFIG,
			scanFolder: 'app',
			methods: ['log', 'debug'],
		})
	})

	it('throws a readable error for invalid JSON', () => {
		const cwd = makeTempDir()
		fs.writeFileSync(path.join(cwd, 'console-seeker.config.json'), '{')

		expect(() => loadConfig('console-seeker.config.json', cwd)).toThrow(
			/Error loading configuration/,
		)
	})
})

describe('createDefaultConfig', () => {
	it('writes the default config file', () => {
		const cwd = makeTempDir()
		const written = createDefaultConfig('console-seeker.config.json', cwd)
		const parsed = JSON.parse(fs.readFileSync(written, 'utf8'))
		expect(parsed).toEqual(DEFAULT_CONFIG)
	})
})
