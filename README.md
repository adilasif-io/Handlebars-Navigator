
# Handlebars Navigator

🚀 Visual Studio Code extension for easy Handlebars navigation.

## Features

- **Navigate with Ease:** Quickly jump to the definition of Handlebars partials, by simply CTRL + Click on the Partial. Ex: *{{>_partial-name}}*.

- **Handlebars Highlighting:** Tailored support for Handlebars syntax, highlighting the handlebar mustaches and the partial names.

![How to use.](https://raw.githubusercontent.com/adilasif-io/Handlebars-Navigator/main/images/HN-working.gif)

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Handlebars Navigator"
4. Click Install to add the extension to your environment

## Usage

1. Open an HTML file with handlebars in Visual Studio Code
2. Use Ctrl+Click on a partial. Ex: {{>_partial-name}}
4. _partial-name.html will be opened

   **Please note, Partials should exist as an html file in the "src>partials" folder. Can be any subfolders after that.**

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

## Contributing

Contributions are welcome! Whether you find a bug, have a feature request, or want to contribute code, please feel free to [open an issue](https://github.com/adilasif-io/handlebars-navigator/issues) or submit a pull request.


## License

This project is licensed under the [MIT License](LICENSE).

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
