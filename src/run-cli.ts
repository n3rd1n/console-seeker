import * as fs from 'fs'
import * as path from 'path'
import { Command } from 'commander'
import { createDefaultConfig } from './config'
import { scan } from './index'
import { print } from './printer'

export type ScanCliOptions = {
	config?: string
	json?: boolean
	exitZero?: boolean
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
	const program = new Command()

	program
		.name('console-seeker')
		.description('Find console statements in JavaScript/TypeScript projects')
		.version(readVersion())

	addScanInterface(program)

	addScanInterface(
		program.command('scan').description('Scan a folder for console statements'),
	)

	program
		.command('init')
		.description('Write a default console-seeker.config.json')
		.argument('[path]', 'config file path', 'console-seeker.config.json')
		.action((configPath: string) => {
			const written = createDefaultConfig(configPath)
			console.info(`Default configuration created: ${written}`)
		})

	await program.parseAsync(argv)
}

function addScanInterface(command: Command): void {
	command
		.argument(
			'[path]',
			'directory or file to scan (overrides config.scanFolder)',
		)
		.option('-c, --config <path>', 'path to config file')
		.option('--json', 'print machine-readable JSON')
		.option('--exit-zero', 'always exit with code 0')
		.action(runScan)
}

async function runScan(
	scanPath: string | undefined,
	options: ScanCliOptions,
	command: Command,
): Promise<void> {
	const opts = {
		...command.optsWithGlobals<ScanCliOptions>(),
		...options,
	}
	const result = await scan({
		path: scanPath,
		configPath: opts.config,
	})

	print(result, Boolean(opts.json))

	if (result.count > 0 && !opts.exitZero) {
		process.exitCode = 1
	}
}

function readVersion(): string {
	const pkgPath = path.join(__dirname, '..', 'package.json')
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
		version: string
	}
	return pkg.version
}
