# Handlebars Navigator

🚀 Visual Studio Code extension for easy Handlebars navigation.

## Features

- **Navigate with Ease:** Quickly jump to the definition of Handlebars partials, by simply CTRL + Click on the Partial. Ex: _{{>_partial-name}}_.

- **Handlebars Highlighting:** Tailored support for Handlebars syntax, highlighting the handlebar mustaches and the partial names.

![How to use.](https://raw.githubusercontent.com/adilasif-io/Handlebars-Navigator/main/images/HN-working.gif)

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Handlebars Navigator"
4. Click Install to add the extension to your environment

## Usage

### Navigate to Partial Definition

1. Open an HTML file with handlebars in Visual Studio Code
2. Use Ctrl+Click on a partial. Ex: {{>_partial-name}}
3. \_partial-name.html will be opened

   **Please note, Partials should exist as an html file in the "src>partials" folder. Can be any subfolders after that.**

### Comment out HTML using Handlebars Comment

1. Select the lines that you would like commented
2. Press CTRL + SHIFT + /

### Create a Partial from Selected Code

1. Select the code you want to convert into a partial.  
2. Press the shortcut `Ctrl + Alt + P` (or use the command palette) to run the `Create Partial` command.  
3. Enter a name for the partial in the input box.  
4. The selected code will:  
   - Be moved to a new file in the `src/partials` folder.  
   - The file will be saved with the name you provided and a `.html` extension.  
   - A reference to the new partial (e.g., `{{> partial-name }}`) will replace the selected code in the current file.  

   **Note:** If the `src/partials` folder does not exist, it will be created automatically.  

## Running Locally to Debug and Test

To test the extension locally in a development environment, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/adilasif-io/handlebars-navigator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd handlebars-navigator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Open file `src > extension.ts`

5. Run Debug mode by pressing `F5` on your keyboard and select `VS Code Extension Development`

## Building Locally

To build the extension locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/adilasif-io/handlebars-navigator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd handlebars-navigator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the extension:
   ```bash
   npx tsc
   ```

## Building VSIX

To build the VSIX package, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/adilasif-io/handlebars-navigator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd handlebars-navigator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Install Visual Studio Code CLI:

   ```bash
   npm install -g @vscode/vsce
   ```

5. Run the packaging process:
   ```bash
   vsce package
   ```

## Contributing

Contributions are welcome! Whether you find a bug, have a feature request, or want to contribute code, please feel free to [open an issue](https://github.com/adilasif-io/handlebars-navigator/issues) or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
