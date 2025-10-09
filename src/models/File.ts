import { FileDetail } from "./FileDetail"

export type Type = {
	path: string
	log: FileDetail.Type
}

export function create(): Type {
    return {
        path :'',
        log: FileDetail.create()

    }
}

export * as File from './File'
