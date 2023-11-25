import { writeFileSync, readFileSync } from 'node:fs';
import { parseHeadings } from '../../src/parseHeadings.js';

const template = readFileSync('./src/templates/page.template.html', 'utf8');

export function render(filePath) {
    const outputFilePath = getOutputFilePath(filePath);
    const content = getFileContent(filePath);
    const output = template.replace('{{title}}', getPageTitle()).replace('{{content}}', content);

    writeFileSync(outputFilePath, output);
}

function getFileContent(filePath) {
    const fileContents = readFileSync(filePath, 'utf-8');

    return parseHeadings(fileContents);
}

function getPageTitle() {``
    return 'A title...';
}

function getOutputFilePath(filePath) {
    const fileName = filePath.match(/([\w-]+)\.md/)[1];
    return './docs/' + fileName + '.html';
}