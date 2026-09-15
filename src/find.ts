import { ConsoleMatch } from './types'

const ESLINT_NO_CONSOLE =
	/eslint-disable(?:-next-line|-line)?[^\n]*\bno-console\b/
const FILE_DISABLE =
	/\/\*\s*eslint-disable(?:\s+(?:(?!\*\/).)*?)?\bno-console\b/
const SEEKER_IGNORE = /console-seeker-ignore\b/

export function findMatches(source: string, methods: string[]): ConsoleMatch[] {
	if (!methods.length) return []
	if (FILE_DISABLE.test(source)) return []

	const methodSet = new Set(methods)
	const raw = findRawMatches(source, methodSet)
	const lines = source.split(/\r?\n/)

	return raw.filter((match) => !isSuppressed(lines, match.line))
}

function isSuppressed(lines: string[], lineNumber: number): boolean {
	const line = lines[lineNumber - 1] ?? ''
	if (ESLINT_NO_CONSOLE.test(line) && /eslint-disable-line/.test(line)) {
		return true
	}

	const prev = lines[lineNumber - 2] ?? ''
	if (ESLINT_NO_CONSOLE.test(prev) && /eslint-disable-next-line/.test(prev)) {
		return true
	}
	if (SEEKER_IGNORE.test(prev) || SEEKER_IGNORE.test(line)) {
		return true
	}

	return false
}

function findRawMatches(source: string, methods: Set<string>): ConsoleMatch[] {
	const matches: ConsoleMatch[] = []
	const lines = source.split(/\r?\n/)

	let i = 0
	let line = 1
	let column = 1
	let inBlockComment = false
	let inLineComment = false
	let stringChar: "'" | '"' | '`' | null = null
	let templateExprDepth = 0

	const advance = (count = 1): void => {
		for (let n = 0; n < count; n++) {
			if (source[i] === '\n') {
				line++
				column = 1
				inLineComment = false
			} else {
				column++
			}
			i++
		}
	}

	while (i < source.length) {
		const char = source[i]
		const next = source[i + 1]

		if (inLineComment) {
			advance()
			continue
		}

		if (inBlockComment) {
			if (char === '*' && next === '/') {
				inBlockComment = false
				advance(2)
				continue
			}
			advance()
			continue
		}

		if (stringChar) {
			if (char === '\\') {
				advance(2)
				continue
			}

			if (stringChar === '`' && char === '$' && next === '{') {
				templateExprDepth++
				stringChar = null
				advance(2)
				continue
			}

			if (char === stringChar) {
				stringChar = null
			}
			advance()
			continue
		}

		if (templateExprDepth > 0 && char === '}') {
			templateExprDepth--
			stringChar = '`'
			advance()
			continue
		}

		if (char === '/' && next === '/') {
			inLineComment = true
			advance(2)
			continue
		}

		if (char === '/' && next === '*') {
			inBlockComment = true
			advance(2)
			continue
		}

		if (char === "'" || char === '"' || char === '`') {
			stringChar = char
			advance()
			continue
		}

		if (
			char === 'c' &&
			isWordStart(source, i) &&
			source.startsWith('console.', i)
		) {
			const methodStart = i + 'console.'.length
			const method = readIdentifier(source, methodStart)
			if (method && methods.has(method)) {
				const afterMethod = methodStart + method.length
				const call = skipWs(source, afterMethod)
				if (source[call] === '(') {
					matches.push({
						line,
						column,
						method,
						text: (lines[line - 1] ?? '').trim(),
					})
					advance(call + 1 - i)
					continue
				}
			}
		}

		advance()
	}

	return matches
}

function isWordStart(source: string, index: number): boolean {
	if (index === 0) return true
	return !/[A-Za-z0-9_$]/.test(source[index - 1] ?? '')
}

function readIdentifier(source: string, start: number): string {
	let end = start
	while (end < source.length && /[A-Za-z0-9_$]/.test(source[end] ?? '')) {
		end++
	}
	return source.slice(start, end)
}

function skipWs(source: string, start: number): number {
	let index = start
	while (index < source.length && /[ \t]/.test(source[index] ?? '')) {
		index++
	}
	return index
}
