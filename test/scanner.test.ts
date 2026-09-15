import * as path from 'path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config'
import { isIgnored } from '../src/scanner'
import { scan } from '../src/index'

const fixtureRoot = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'fixtures',
	'sample-project',
)

describe('scan', () => {
	it('finds console.log calls with line numbers and skips ignored paths', async () => {
		const result = await scan({
			path: fixtureRoot,
			cwd: fixtureRoot,
			config: loadConfig('console-seeker.config.json', fixtureRoot),
		})

		expect(result.count).toBeGreaterThan(0)
		expect(result.files.map((file) => file.path)).toEqual([
			'src/app.ts',
			'src/methods.ts',
			'src/template.ts',
		])

		const app = result.files.find((file) => file.path === 'src/app.ts')
		expect(app?.matches.map((match) => match.line)).toEqual([2, 3])
		expect(app?.matches[1]?.text).toContain("console.log('time:', new Date()")
	})

	it('uses scanFolder from config when no path is passed', async () => {
		const result = await scan({
			cwd: fixtureRoot,
			configPath: 'console-seeker.config.json',
		})

		expect(result.files.some((file) => file.path.startsWith('src/'))).toBe(true)
		expect(
			result.files.some((file) => file.path.includes('node_modules')),
		).toBe(false)
	})

	it('can scan a single file', async () => {
		const result = await scan({
			path: path.join(fixtureRoot, 'src/clean.ts'),
			cwd: fixtureRoot,
			config: loadConfig('console-seeker.config.json', fixtureRoot),
		})

		expect(result).toEqual({ count: 0, files: [] })
	})

	it('throws when the scan folder is missing', async () => {
		await expect(
			scan({
				path: path.join(fixtureRoot, 'does-not-exist'),
				cwd: fixtureRoot,
			}),
		).rejects.toThrow(/Scan folder does not exist/)
	})
})

describe('isIgnored', () => {
	it('matches path segments and relative prefixes', () => {
		expect(
			isIgnored('/repo/src/node_modules/pkg/index.js', '/repo', [
				'node_modules',
			]),
		).toBe(true)
		expect(
			isIgnored('/repo/src/generated/file.ts', '/repo', ['src/generated']),
		).toBe(true)
		expect(isIgnored('/repo/src/app.ts', '/repo', ['node_modules'])).toBe(false)
	})
})
