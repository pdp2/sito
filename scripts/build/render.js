import { writeFileSync, readFileSync } from 'node:fs';
import { parseHeadings } from '../../src/parser/parseHeadings.js';
import { parseParagraphs } from '../../src/parser/parseParagraphs.js';
import { inTagRegExp } from './regexp.js';

const template = readFileSync('./src/templates/page.template.html', 'utf8');

export function render(filePath) {
    const outputFilePath = getOutputFilePath(filePath);
    const content = getFileContent(filePath);
    const output = template.replace('{{title}}', getPageTitle()).replace('{{content}}', content);

    writeFileSync(outputFilePath, output);
}

function getFileContent(filePath) {
    const numOfSpaces = 4;
    const fileContents = readFileSync(filePath, 'utf-8');
    const lines = fileContents.split('\n');
    const parsedLines = lines.map(line => {
        // If empty string return, we don't want unnecessary p tag
        if (typeof line === 'string' && !line) {
            return line;
        }

        let output = parseHeadings(line);

        if (isAlreadyInTag(output)) {
            return output;
        }

        output = parseParagraphs(output);
        return output;
    });

    return parsedLines.filter(line => line).join('\n' + getSpaces(numOfSpaces));
}

function getPageTitle() {``
    return 'A title...';
}

function getOutputFilePath(filePath) {
    const fileName = filePath.match(/([\w-]+)\.md/)[1];
    return './docs/' + fileName + '.html';
}

function getSpaces(numOfSpaces) {
    let output = '';

    for (let i=0; i<numOfSpaces; i++) {
        output += ' ';
    }

    return output;
}

export function isAlreadyInTag(string) {
    return inTagRegExp.test(string);
}