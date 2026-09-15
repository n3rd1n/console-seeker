export type ConsoleMatch = {
	line: number
	column: number
	method: string
	text: string
}

export type FileMatch = {
	path: string
	count: number
	matches: ConsoleMatch[]
}

export type ScanResult = {
	count: number
	files: FileMatch[]
}

export type Config = {
	scanFolder: string
	ignorePaths: string[]
	extensions: string[]
	methods: string[]
}

export type PartialConfig = {
	scanFolder?: string
	ignorePaths?: string[]
	extensions?: string[]
	methods?: string[]
}
