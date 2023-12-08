import { writeFileSync, readFileSync } from 'node:fs';
import { parseHeadings } from '../../src/parser/parseHeadings.js';
import { parseParagraphs } from '../../src/parser/parseParagraphs.js';
import { inTagRegExp, h1RegExp } from './regexp.js';

const template = readFileSync('./src/templates/page.template.html', 'utf8');

export function render(filePath) {
    const outputFilePath = getOutputFilePath(filePath);
    const fileContent = readFileSync(filePath, 'utf-8');
    const content = getParsedContent(fileContent);
    const output = template.replace('{{title}}', getPageTitle(fileContent)).replace('{{content}}', content);

    writeFileSync(outputFilePath, output);
}

function getParsedContent(fileContent) {
    const numOfSpaces = 4;
    const lines = fileContent.split('\n');
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

function getPageTitle(fileContent) {
    const mainHeadingMatch = fileContent.match(h1RegExp);
    let title = 'Paolo Di Pasquale\'s blog';
    let pageTitle = mainHeadingMatch && mainHeadingMatch[1] ? mainHeadingMatch[1] : '';

    if (pageTitle) {
        title = pageTitle + ' | ' + title;
    }

    return title;
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