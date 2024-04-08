# Sugoi Batch Visual Novel Translator

This script automates the translation process for Japanese visual novels using Sugoi Translator, facilitating localization efforts for international audiences. Sugoi Translator is a machine translation service hosted locally using Flask servers.

### Instructions:

1. **Extract Text Using VNtextPatch**:
   - Use [VNtextPatch](https://github.com/arcusmaximus/VNTranslationTools) to extract text from the visual novel and save it in JSON format. Ensure each JSON file contains an array of objects with a "message" property containing the text to be translated.

2. **Start Sugoi Translator Servers**:
   - Run Sugoi Translator servers locally. These servers can be set up on any number of instances, CPU or GPU-based, each listening on a specific port.

3. **Set Directory Path and Ports**:
   - Update `directoryPath` with the directory path containing the JSON files to be translated.
   - Modify `pythonFlaskServerPorts` to include the ports of Sugoi Translator servers.

4. **Run the Script**:
   - Execute the script to process JSON files, translate text using Sugoi Translator, and replace original text with translations.

### Usage Example:

```javascript
const directoryPath = 'C:\\path\\to\\json\\files'; // Update with directory path containing JSON files
const pythonFlaskServerPorts = [14366, 14367, 14368]; // Update with Sugoi Translator ports

(async () => {
  await translateJsonFilesInDirectory(directoryPath, pythonFlaskServerPorts);
})();
```

### Additional Notes:

- **Text Filtering**:
  - Modify input and translation text filtering functions as needed for preprocessing or postprocessing text.

- **Error Handling**:
  - Script handles errors during translation and file processing. Check console output for error messages.

- **Customization**:
  - Customize translation filters and other functions as per specific requirements.

- **Batch Translation**:
  - The script supports batch translation to optimize processing time. Set `translationBatchSize` to adjust the number of messages translated in each batch.

### Acknowledgments:

- Special thanks to [Sugoi Translator](https://github.com/leminhyen2/Sugoi-Japanese-Translator) for providing the machine translation service.
- Credits to [VNtextPatch](https://github.com/arcusmaximus/VNTranslationTools) for their contribution to text extraction from visual novels.

### Disclaimer:

This script is not perfect and may require additional modifications to suit specific use cases. Use it at your own discretion, and consider testing thoroughly before applying it to production environments.
