import { afterEach, describe, expect, it, vi } from 'vitest'
import { print } from '../src/printer'
import { ScanResult } from '../src/types'

const result: ScanResult = {
	count: 2,
	files: [
		{
			path: 'src/app.ts',
			count: 2,
			matches: [
				{
					line: 2,
					column: 2,
					method: 'log',
					text: "console.log('hello')",
				},
				{
					line: 3,
					column: 2,
					method: 'log',
					text: "console.log('time:', now)",
				},
			],
		},
	],
}

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('print', () => {
	it('prints colorized human output and does not exit', () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {})
		const exit = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit should not be called')
		})

		print(result)

		expect(exit).not.toHaveBeenCalled()
		expect(info.mock.calls.map((call) => stripAnsi(String(call[0])))).toEqual([
			'2 ERROR(S):',
			'src/app.ts',
			"   2: console.log('hello')",
			"   3: console.log('time:', now)",
		])
	})

	it('prints JSON when requested', () => {
		const log = vi.spyOn(console, 'log').mockImplementation(() => {})
		print(result, true)
		expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual(result)
	})

	it('prints a green zero count for clean results', () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {})
		print({ count: 0, files: [] })
		expect(stripAnsi(String(info.mock.calls[0]?.[0]))).toBe('0 ERROR(S):')
	})
})

function stripAnsi(value: string): string {
	return value.replace(/\u001b\[\d+m/g, '')
}
