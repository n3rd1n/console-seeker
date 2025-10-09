import { Command } from 'commander'
import * as Main from './models/Main'

const program = new Command()

program.name('console-seeker').description(
	'Find unused console-Statements in JavaScript/TypeScript projects'
)

program.command('scan').description('Scan Folder').action(Main.scan)

Main.scan()
