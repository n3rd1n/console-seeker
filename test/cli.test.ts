import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCli } from '../src/run-cli'

const fixtureRoot = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'fixtures',
	'sample-project',
)
const configPath = path.join(fixtureRoot, 'console-seeker.config.json')
const cleanFile = path.join(fixtureRoot, 'src/clean.ts')

afterEach(() => {
	vi.restoreAllMocks()
	process.exitCode = undefined
})

describe('runCli', () => {
	it('prints JSON for a clean file and keeps a zero exit code', async () => {
		const log = vi.spyOn(console, 'log').mockImplementation(() => {})

		await runCli([
			'node',
			'console-seeker',
			'--json',
			cleanFile,
			'--config',
			configPath,
		])

		expect(process.exitCode ?? 0).toBe(0)
		expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual({
			count: 0,
			files: [],
		})
	})

	it('sets exit code 1 when matches exist, unless --exit-zero is passed', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {})

		await runCli([
			'node',
			'console-seeker',
			'scan',
			fixtureRoot,
			'--config',
			configPath,
		])
		expect(process.exitCode).toBe(1)

		process.exitCode = undefined
		await runCli([
			'node',
			'console-seeker',
			'scan',
			fixtureRoot,
			'--config',
			configPath,
			'--exit-zero',
		])
		expect(process.exitCode ?? 0).toBe(0)
	})

	it('writes a default config file with init', async () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'console-seeker-cli-'))
		const info = vi.spyOn(console, 'info').mockImplementation(() => {})
		const configFile = path.join(dir, 'console-seeker.config.json')

		try {
			await runCli(['node', 'console-seeker', 'init', configFile])
			expect(fs.existsSync(configFile)).toBe(true)
			expect(String(info.mock.calls[0]?.[0])).toContain(configFile)
		} finally {
			fs.rmSync(dir, { recursive: true, force: true })
		}
	})
})
