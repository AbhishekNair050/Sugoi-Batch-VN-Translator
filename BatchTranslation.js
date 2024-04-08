const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

let translationBatchSize = 5;
let translationBatchSeparator = '###';
let lineRecognizingCharacter = '####';

async function translateJsonFilesInDirectory(directoryPath, pythonFlaskServerPorts) {
    try {
        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(directoryPath, file);
                await processAndReplaceMessagesWithTranslation(filePath, pythonFlaskServerPorts);
                console.log(`${file} done`);
            }
        }

        console.log('All files in the directory processed.');
    } catch (error) {
        console.error('Error processing JSON files in the directory:', error);
    }
}

async function processAndReplaceMessagesWithTranslation(jsonFilePath, pythonFlaskServerPorts) {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const messagesToTranslate = jsonData
            .filter(entry => entry.hasOwnProperty('message'))
            .map(entry => entry.message);

        const messageBatches = [];
        for (let i = 0; i < messagesToTranslate.length; i += translationBatchSize) {
            const batch = messagesToTranslate.slice(i, i + translationBatchSize);
            messageBatches.push(batch.join(translationBatchSeparator));
        }

        const translationResults = await Promise.all(messageBatches.map((batch, index) => translateBatch(batch, pythonFlaskServerPorts[index % pythonFlaskServerPorts.length])));


        const flatResults = translationResults.flat();

        let resultIndex = 0;
        for (let i = 0; i < jsonData.length; i++) {
            const entry = jsonData[i];
            if (entry.hasOwnProperty('message')) {
                entry.message = flatResults[resultIndex];
                resultIndex++;
            }
        }

        await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

        console.log(`Processing complete for ${jsonFilePath}. Updated JSON data with translations written to the file.`);
    } catch (error) {
        console.error(`Error processing and replacing messages with translations for ${jsonFilePath}:`, error);
    }
}

async function translateBatch(batch, pythonFlaskServerPort) {
    try {
        const response = await axios.post(`http://localhost:${pythonFlaskServerPort}/`, {
            content: inputTextFilter(batch),
            message: "translate sentences"
        });

        const translationText = response.data.split(translationBatchSeparator);
        const translatedTexts = translationText.map(translationFilter);

        return translatedTexts;
    } catch (error) {
        console.error('Error during batch translation:', error);
        return Array(batch.length).fill(null);
    }
}

const directoryPath = ' '; // Replace with your directory path
const pythonFlaskServerPorts = []; // Replace with your flask port(s) (seperated by commas)

(async () => {
    await translateJsonFilesInDirectory(directoryPath, pythonFlaskServerPorts);
})();

function inputTextFilter(text) {
    return text;
}

function translationFilter(translationText) {
    let result = translationText;

    result = result.replace(/\n/g, "<br>");
    result = result.replace(/{/g, "");
    result = result.replace("�", "");
    result = result.replace(/カ$/, "");
    result = result.replace(/987$/, "?");
    result = result.replace(/^:/, "");

    return result;
}
