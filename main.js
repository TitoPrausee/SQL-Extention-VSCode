const axios = require('axios');
const vscode = require('vscode');

const GPT_API_KEY = 'INSERT_YOUR_GPT_API_KEY_HERE';

// Function to send text to the GPT-3 API
async function generateSQL(text) {
 try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-codex/completions',
      {
        prompt: text,
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GPT_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
 } catch (error) {
    console.error('Error fetching data from the GPT-3 API:', error.message);
    return null;
 }
}

// Function to process code commands in the code
async function processCodeCommands() {
 const editor = vscode.window.activeTextEditor;

 if (!editor) {
    return;
 }

 const document = editor.document;
 const selection = editor.selection;
 const selectedText = document.getText(selection);

 // Here you can specify the specific commands you want to recognize
 if (selectedText.startsWith('//sql')) {
    const codeToConvert = selectedText.substring(5); // Remove the "//sql" at the beginning
    const sqlCode = await generateSQL(codeToConvert);

    if (sqlCode) {
      vscode.window.showInformationMessage('Generated SQL code: ' + sqlCode);
    } else {
      vscode.window.showErrorMessage('Error generating the SQL code.');
    }
 }
}

// Register the command and bind it to a keyboard shortcut
function activate(context) {
 let disposable = vscode.commands.registerCommand('extension.generateSQL', processCodeCommands);
 context.subscriptions.push(disposable);
}

exports.activate = activate;