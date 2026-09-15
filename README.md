# Console Seeker

A command-line tool to find `console` statements in JavaScript and TypeScript projects. Use it for cleanup work or as a CI check that fails when leftover debug logs are present.

## Features

- Finds real `console.*` calls, including line numbers
- Skips comments, string literals, ignored folders, and unmatched file types
- Honors `eslint-disable` / `console-seeker-ignore` suppressions
- Colorized terminal output or JSON
- Configurable scan folder, ignore paths, extensions, and console methods
- Exit code `1` when matches are found, so CI jobs can fail the build

## Installation

### Global

```bash
npm install -g console-seeker
```

### Local

```bash
npm install --save-dev console-seeker
```

## Usage

Scan with the config file (defaults to the `src` folder):

```bash
console-seeker
```

Scan a specific directory or file:

```bash
console-seeker scan /path/to/your/project
console-seeker scan src/app.ts
```

`scan` is the default command, so this is equivalent:

```bash
console-seeker /path/to/your/project
```

Write a default config file:

```bash
console-seeker init
```

Machine-readable output:

```bash
console-seeker --json
```

Report matches without failing the process:

```bash
console-seeker --exit-zero
```

### Programmatic usage

```javascript
const { scan } = require('console-seeker')

async function main() {
	const result = await scan()
	if (result.count > 0) {
		console.error(result)
		process.exitCode = 1
	}
}

main()
```

`scan()` returns data and does not exit the process. Pass `{ path, cwd, config, configPath }` to control the run.

## Configuration

Create a `console-seeker.config.json` file in your project root:

```json
{
	"scanFolder": "src",
	"ignorePaths": ["node_modules", "dist", "build", ".git", "coverage"],
	"extensions": [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs", ".mts", ".cts"],
	"methods": ["log"]
}
```

A CLI path argument overrides `scanFolder`. Use `--config <path>` to load a different file.

### Configuration options

| Option        | Type     | Default                                                          | Description                                                         |
| ------------- | -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `scanFolder`  | string   | `"src"`                                                          | Directory to scan when no CLI path is given                         |
| `ignorePaths` | string[] | `["node_modules", "dist", "build", ".git", "coverage"]`          | Folder names or relative paths to skip                              |
| `extensions`  | string[] | `[".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs", ".mts", ".cts"]` | File extensions to include                                          |
| `methods`     | string[] | `["log"]`                                                        | `console` methods to report (`debug`, `info`, `warn`, `error`, ...) |

## Output

Colorized human output:

- **Red**: one or more matches
- **Green**: no matches
- **Blue**: file path
- Line number plus the source line for each match

```
3 ERROR(S):
src/components/Button.tsx
   15: console.log('Button clicked')
   23: console.log('Debug info:', props)
src/utils/helpers.js
   8: console.log('Helper function called')
```

JSON output is a `ScanResult` object: `{ count, files: [{ path, count, matches }] }`.

## Suppressing matches

These are skipped:

- Line comments and block comments
- String and template literals (calls inside `${...}` still count)
- `// eslint-disable-next-line no-console`
- `// eslint-disable-line no-console`
- `/* eslint-disable no-console */`
- `// console-seeker-ignore` on the line above a call

## Exit codes

- `0`: no matches, or `--exit-zero` was passed
- `1`: matches found, or the scan failed (missing folder, invalid config)

## Integration

### Git hook

```bash
#!/bin/sh
npx console-seeker
```

### package.json

```json
{
	"scripts": {
		"check-console": "console-seeker",
		"prebuild": "console-seeker"
	}
}
```

### GitHub Actions

```yaml
- name: Check for console statements
  run: npx console-seeker
```

## License

MIT © [n3rd1n](https://github.com/n3rd1n)

## Repository

- **GitHub**: [https://github.com/n3rd1n/console-seeker](https://github.com/n3rd1n/console-seeker)
- **Issues**: [https://github.com/n3rd1n/console-seeker/issues](https://github.com/n3rd1n/console-seeker/issues)
