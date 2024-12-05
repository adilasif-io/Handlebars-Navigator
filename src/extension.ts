import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const partialDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#42c684',  // Color for partial name (e.g., _banner-detail-page)
    });
    const partialNameDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#43a9e8',  // Color for partial name (e.g., _banner-detail-page)
    });
    const braceDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#42c684',  // Color for {{ and }}
    });

    const variableDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#FF0000',  // Color for variable names (e.g., PageTitle)
    });

    const valueDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#FFA500',  // Color for variable values (e.g., title, 1, 1, 'assets/img/inner-banner.png')
    });

    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        highlightPartials(activeEditor, partialDecorationType, partialNameDecorationType, braceDecorationType, variableDecorationType, valueDecorationType);
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            highlightPartials(editor, partialDecorationType, partialNameDecorationType, braceDecorationType, variableDecorationType, valueDecorationType);
        }
    });

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (activeEditor && event.document === activeEditor.document) {
                highlightPartials(activeEditor, partialDecorationType, partialNameDecorationType, braceDecorationType, variableDecorationType, valueDecorationType);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.createPartial', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active editor found!");
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (!selectedText || selection.isEmpty) {
                vscode.window.showErrorMessage("Please select some code to convert to a partial.");
                return;
            }

            const partialName = await vscode.window.showInputBox({
                prompt: "Enter a name for the new partial",
                placeHolder: "e.g., _header",
            });

            if (!partialName) {
                vscode.window.showErrorMessage("Partial name cannot be empty.");
                return;
            }

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("No workspace folder found.");
                return;
            }

            const workspaceRoot = workspaceFolders[0].uri.fsPath;
            const partialsFolder = path.join(workspaceRoot, 'src', 'partials');

            if (!fs.existsSync(partialsFolder)) {
                fs.mkdirSync(partialsFolder, { recursive: true });
            }

            const newFilePath = path.join(partialsFolder, `${partialName}.html`);

            if (fs.existsSync(newFilePath)) {
                vscode.window.showErrorMessage(`A partial with the name "${partialName}" already exists.`);
                return;
            }

            fs.writeFileSync(newFilePath, selectedText);

            const partialReference = `{{> ${partialName} }}`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, partialReference);
            });

            vscode.window.showInformationMessage(`Partial "${partialName}.html" created successfully.`);
        })
    );

    const provider = new PartialSymbolProvider();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider('html', provider));
    context.subscriptions.push(vscode.commands.registerCommand('extension.handlebarsWrapComment', handlebarsWrapComment));
}


// Function to wrap or unwrap text in Handlebars comment
function handlebarsWrapComment() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const selection = editor.selection;

    // Get the text of the selected range or current line
    let text: string;
    let range: vscode.Range;
    if (!selection.isEmpty) {
        text = document.getText(selection);
        range = selection;
    } else {
        const line = document.lineAt(selection.active.line);
        text = line.text.trim();
        range = line.range;
    }

    // Check if the text is wrapped in Handlebars comments
    const isWrapped = isTextWrapped(text);

    // If text is wrapped, unwrap it; otherwise, wrap it
    const newText = isWrapped ? unwrapHandlebarsComment(text) : wrapInHandlebarsComment(text);

    // Replace the selected range or current line with the new text
    editor.edit(editBuilder => {
        editBuilder.replace(range, newText);
    });
}


// Function to check if text is wrapped in Handlebars comments
function isTextWrapped(text: string): boolean {
    return text.startsWith('{{!--') && text.endsWith('--}}');
}

// Function to unwrap Handlebars comment
function unwrapHandlebarsComment(text: string): string {
    return text.substring('{{!--'.length, text.length - '--}}'.length).trim();
}

// Function to wrap text in Handlebars comment
function wrapInHandlebarsComment(text: string) {
    return `{{!-- ${text} --}}`;
}

// Define decoration type for collapsible comments
const collapsibleCommentDecoration = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    before: {
        contentText: '⌄',
        color: 'lightgray'
    }
});

function highlightPartials(
    editor: vscode.TextEditor,
    partialDecorationType: vscode.TextEditorDecorationType,
    braceDecorationType: vscode.TextEditorDecorationType,
    partialNameDecorationType: vscode.TextEditorDecorationType,
    variableDecorationType: vscode.TextEditorDecorationType,
    valueDecorationType: vscode.TextEditorDecorationType
) {

    
    const text = editor.document.getText();
    
    let match;
    
    // Highlight partial name
    const partialNameRegex = /{{>\s*([_a-zA-Z$][\w$]*(?:-[_a-zA-Z$][\w$]*)*)\s*[^}]*}}/g;
    const partialNames = [];
    const partials = [];
    
    while ((match = partialNameRegex.exec(text))) {
        const partialName = match[1];
        // Attach the command to navigate to the partial file
        const command = {
            title: 'Navigate to Partial File',
            command: 'extension.navigateToPartialFile',
            arguments: [match[1]],
        };
        if (match[0].search(partialName) > 3) { //Meaning it has more characters than "{{>" i.e. space
            const startPosition = editor.document.positionAt(match.index + '{{>'.length);
            const endPosition = editor.document.positionAt(match.index + '{{>'.length + partialName.length + match[0].search(partialName)-3);
            const range = new vscode.Range(startPosition, endPosition);
            const decoration = {
                range,
                hoverMessage: `Click to open ${match[1]}.html`,
                command: command
            };
            partialNames.push(decoration);
        }
        else {
            const startPosition = editor.document.positionAt(match.index + '{{>'.length);
            const endPosition = editor.document.positionAt(match.index + '{{>'.length + partialName.length);
            const range = new vscode.Range(startPosition, endPosition);
            const decoration = {
                range,
                hoverMessage: `Click to open ${match[1]}.html`,
                command: command
            };
            partialNames.push(decoration);
        }
        // Highlight variables and values
        const variableValueRegex = /\b([a-zA-Z_$][\w$]*)\s*=\s*(?:(\d+)|'([^']+)'|"([^"]+)")/g;
        const variableValueMatches = [];
        while ((match = variableValueRegex.exec(match[2]))) {
            const variableName = match[1];
            const variableValue = match[2] || match[3] || match[4]; // Use the non-null matched value
            const variableStartPosition = editor.document.positionAt(match.index);
            const variableEndPosition = editor.document.positionAt(match.index + match[0].length);
            const variableRange = new vscode.Range(variableStartPosition, variableEndPosition);
            const variableDecoration = {
                range: variableRange,
                hoverMessage: `Variable: ${variableName}`,
            };
            variableValueMatches.push(variableDecoration);
            // Highlight the content after the equal sign as the value
            const equalSignPosition = editor.document.positionAt(match.index + match[0].indexOf('=') + 1);
            const equalSignRange = new vscode.Range(equalSignPosition, variableEndPosition);
            const valueDecoration = { range: equalSignRange };
            variableValueMatches.push(valueDecoration);
        }
        editor.setDecorations(variableDecorationType, variableValueMatches);
    }
    editor.setDecorations(partialDecorationType, partialNames);

    // Highlight {{ and }}
    const braceRegex = /{{|}}/g;
    const braces: vscode.DecorationOptions[] = [];

    while ((match = braceRegex.exec(text))) {
        const startPosition = editor.document.positionAt(match.index);
        const endPosition = editor.document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPosition, endPosition);

        const decoration = { range };
        braces.push(decoration);
    }

    editor.setDecorations(braceDecorationType, braces);
}

class PartialSymbolProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        const wordRange = document.getWordRangeAtPosition(position);
        const partialName = document.getText(wordRange);

        const rootPath = vscode.workspace.rootPath;

        if (!rootPath) {
            return undefined;
        }

        const partialsRoot = path.join(rootPath, 'src', 'partials');
        const htmlFilePath = findPartialFile(partialsRoot, partialName);

        if (htmlFilePath) {
            const location = new vscode.Location(vscode.Uri.file(htmlFilePath), new vscode.Position(0, 0));
            return location;
        }

        return undefined;
    }
}

function findPartialFile(directory: string, partialName: string): string | undefined {
    const htmlFilePath = path.join(directory, `${partialName}.html`);

    if (fs.existsSync(htmlFilePath)) {
        return htmlFilePath;
    }

    const subdirectories = fs.readdirSync(directory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(directory, dirent.name));

    for (const subdirectory of subdirectories) {
        const foundPath = findPartialFile(subdirectory, partialName);
        if (foundPath) {
            return foundPath;
        }
    }

    return undefined;
}