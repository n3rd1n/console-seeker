export type Type = {
	count: number
	details: string[]
}

export function create(): Type {
	return {
		count: 0,
		details: [],
	}
}

export * as FileDetail from './FileDetail'
