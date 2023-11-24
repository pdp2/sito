// import { readFileSync, readdirSync, writeFile } from 'node:fs';
// //import { parseHeadings } from '../../src/parseHeadings.js';
export const pageFolderPath = './pages/';
export const postFolderPath = './posts/';

// const pageFiles = readdirSync(pageFolderPath);
// const postFiles = readdirSync(postFolderPath);
// //const template = readFileSync('./src/templates/page.template.html', 'utf8');

// pageFiles.forEach(fileName => render({fileName, type: 'page'}));
// postFiles.forEach(fileName => render({fileName, type: 'post'}));

// // function render({fileName, type}) {
// //     const filePath = getFilePath({fileName, type});
// //     const outputFilePath = getOutputFilePath({fileName, type});
// //     const content = getFileContent(filePath);
// //     const output = template.replace('{{title}}', getPageTitle()).replace('{{content}}', content);

// //     writeFile(outputFilePath, output, err => {
// //         if (err) {
// //             console.log(err);
// //         }
// //     });
// // }

// // function getFileContent(filePath) {
// //     const fileContents = readFileSync(filePath, 'utf-8');

// //     return parseHeadings(fileContents);
// // }

// // function getFilePath({fileName, type}) {
// //     if (type === 'post') {
// //         return postFolderPath + fileName;
// //     }
// //     else if (type === 'page') {
// //         return pageFolderPath + fileName;
// //     }
// //     else {
// //         throw new Error('Sorry, type "' + type + '" is not supported');
// //     }
// // }

// // function getPageTitle() {``
// //     return 'A title...';
// // }

// // function getOutputFilePath({fileName, type}) {
// //     const folder = getFolderPath(type);
// //     return './docs/' + folder + fileName.replace('.md', '.html')
// // }

// // function getFolderPath(type) {
// //     if (type === 'post') {
// //         return 'blog/';
// //     }
// //     else {
// //         return '';
// //     }
// // }
