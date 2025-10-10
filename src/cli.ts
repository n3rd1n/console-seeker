#!/usr/bin/env node

import { Command } from 'commander'
import { Main } from './index'

const program = new Command()

program.name('console-seeker').description(
	'Find unused console-Statements in JavaScript/TypeScript projects'
)

program.command('scan').description('Scan Folder').action(Main.scan)

Main.scan()
