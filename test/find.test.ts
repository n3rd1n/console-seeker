import { describe, expect, it } from 'vitest'
import { findMatches } from '../src/find'

describe('findMatches', () => {
	it('reports line numbers and keeps the full line text', () => {
		const source = [
			'export function run(): void {',
			"\tconsole.log('hello')",
			"\tconsole.log('time:', new Date())",
			'}',
			'',
		].join('\n')

		expect(findMatches(source, ['log'])).toEqual([
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
				text: "console.log('time:', new Date())",
			},
		])
	})

	it('ignores comments and string literals', () => {
		const source = [
			"// console.log('nope')",
			'/* console.log("nope") */',
			"const value = 'console.log(1)'",
			'const other = "console.log(2)"',
			'const tpl = `console.log(3)`',
			"console.log('real')",
			'',
		].join('\n')

		expect(findMatches(source, ['log'])).toEqual([
			{
				line: 6,
				column: 1,
				method: 'log',
				text: "console.log('real')",
			},
		])
	})

	it('finds console.log inside template expressions', () => {
		const source = 'const value = `x: ${console.log(1)}`\n'
		expect(findMatches(source, ['log'])).toEqual([
			{
				line: 1,
				column: 21,
				method: 'log',
				text: 'const value = `x: ${console.log(1)}`',
			},
		])
	})

	it('respects the configured method list', () => {
		const source = [
			"console.log('log')",
			"console.debug('debug')",
			"console.warn('warn')",
			'',
		].join('\n')

		expect(findMatches(source, ['log']).map((match) => match.method)).toEqual([
			'log',
		])
		expect(
			findMatches(source, ['log', 'debug']).map((match) => match.method),
		).toEqual(['log', 'debug'])
	})

	it('honors eslint and console-seeker suppressions', () => {
		const source = [
			'// eslint-disable-next-line no-console',
			"console.log('next-line')",
			"console.log('inline') // eslint-disable-line no-console",
			'// console-seeker-ignore',
			"console.log('ignored')",
			"console.log('kept')",
			'',
		].join('\n')

		expect(findMatches(source, ['log'])).toEqual([
			{
				line: 6,
				column: 1,
				method: 'log',
				text: "console.log('kept')",
			},
		])
	})

	it('skips files with a file-level eslint-disable no-console', () => {
		const source = [
			'/* eslint-disable no-console */',
			"console.log('nope')",
			'',
		].join('\n')

		expect(findMatches(source, ['log'])).toEqual([])
	})

	it('does not match identifiers that only contain console', () => {
		const source = "myconsole.log('nope')\nconsole.log('yes')\n"
		expect(findMatches(source, ['log'])).toEqual([
			{
				line: 2,
				column: 1,
				method: 'log',
				text: "console.log('yes')",
			},
		])
	})
})
