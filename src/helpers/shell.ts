import { exec as execSync } from 'child_process'
import util from 'util'
const exec = util.promisify(execSync)

export async function doShellScript(shellScript: string): Promise<string[]> {
	try {
		const { stdout } = await exec(shellScript)
		let output = stdout.split('\n')
		output = output.filter((line) => line !== '')
		return output
	} catch (e) {
		return []
	}
}
