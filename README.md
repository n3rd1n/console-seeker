# Console Seeker

A powerful command-line tool to find and analyze `console.log` statements in JavaScript/TypeScript projects. Perfect for code cleanup and identifying unused logging statements before production deployment.

## Features

- 🔍 **Smart Detection**: Finds all `console.log` statements in your project
- 📊 **Detailed Analysis**: Shows file paths and line numbers for each console statement
- 🎨 **Colorized Output**: Easy-to-read terminal output with color coding
- ⚙️ **Configurable**: Customize scan folders, ignore paths, and file extensions
- 🚀 **Fast**: Uses efficient grep-based scanning for quick results
- 📦 **CLI Tool**: Install globally and use from anywhere

## Installation

### Global Installation (Recommended)
```bash
npm install -g console-seeker
```

### Local Installation
```bash
npm install --save-dev console-seeker
```

## Usage

### Basic Usage
Scan the current directory for console.log statements:
```bash
console-seeker
```

### Scan Specific Directory
```bash
console-seeker scan /path/to/your/project
```

### Programmatic Usage
```javascript
import { Main } from 'console-seeker';

// Scan current directory
await Main.scan();
```

## Configuration

Create a `console-seeker.config.json` file in your project root to customize the scanning behavior:

```json
{
  "scanFolder": "src",
  "ignorePaths": ["node_modules", "dist", "build", ".git", "coverage"],
  "extensions": [".js", ".ts", ".jsx", ".tsx", ".vue"]
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scanFolder` | string | `"src"` | Directory to scan for console statements |
| `ignorePaths` | string[] | `["node_modules", "dist", "build", ".git"]` | Paths to ignore during scanning |
| `extensions` | string[] | `[".js", ".ts", ".jsx", ".tsx"]` | File extensions to include in scanning |

## Output

The tool provides colorized output showing:
- **Red**: Number of console.log statements found (errors)
- **Green**: Zero console statements found (clean code)
- **Blue**: File paths containing console statements
- **White**: Line numbers where console statements are located

Example output:
```
3 ERROR(S):
src/components/Button.tsx
   15: console.log('Button clicked')
   23: console.log('Debug info:', props)
src/utils/helpers.js
   8: console.log('Helper function called')
```

## Exit Codes

- `0`: No console.log statements found (success)
- `1`: Console.log statements found (error)

This makes it perfect for CI/CD pipelines where you want to fail builds that contain console statements.

## Use Cases

- **Pre-deployment cleanup**: Remove console statements before production
- **Code quality**: Maintain clean, production-ready code
- **CI/CD integration**: Fail builds that contain debugging statements
- **Code review**: Quickly identify files with console statements
- **Team standards**: Enforce no-console policies across projects

## Integration

### Git Hooks
Add to your pre-commit hook to prevent console statements from being committed:
```bash
#!/bin/sh
console-seeker
```

### Package.json Scripts
```json
{
  "scripts": {
    "check-console": "console-seeker",
    "prebuild": "console-seeker"
  }
}
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Check for console statements
  run: npx console-seeker
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [n3rd1n](https://github.com/n3rd1n)

## Repository

- **GitHub**: [https://github.com/n3rd1n/log-seeker](https://github.com/n3rd1n/log-seeker)
- **Issues**: [https://github.com/n3rd1n/log-seeker/issues](https://github.com/n3rd1n/log-seeker/issues)