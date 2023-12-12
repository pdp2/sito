import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { parseHeadings } from '#src/parser/parseHeadings.js';
import { parseParagraphs } from '#src/parser/parseParagraphs.js';
import { inTagRegExp, h1RegExp } from '#src/constants/regexp.js';
import { sections } from '#src/interpolator/sections.js';

const runningTests = process.env.NODE_ENV === 'test';
let indexOfPosts = [];

if (!runningTests) {
    build();
}

export function build() {
    const postFolderPath = './posts/';
    const postFiles = readdirSync(postFolderPath) || [];
    const template = readFileSync('./src/templates/page.template.html', 'utf8');
    postFiles.forEach(fileName => buildPage(postFolderPath + fileName, template));

    buildIndex();
}

export function isAlreadyInTag(string) {
    return inTagRegExp.test(string);
}

export function resetIndexCache() {
    indexOfPosts = [];
}

function buildIndex() {
    const outputFilePath = './docs/index.html';
    const template = readFileSync('./src/templates/index.template.html', 'utf8');
    const output = sections(template.replace('{{title}}', getPageTitle('')), {
        links: indexOfPosts.map(item => ({url: getUrl(item), anchorText: getAnchorText(item)}))
    });

    writeFileSync(outputFilePath, output);

    if (!runningTests) {
        console.log('\nBuilt: ' + outputFilePath + '\n');
    }
}

function buildPage(filePath, template) {
    const outputFilePath = getOutputFilePath(filePath);
    const fileContent = readFileSync(filePath, 'utf-8');
    const content = getParsedContent(fileContent);
    const output = template.replace('{{title}}', getPageTitle(fileContent)).replace('{{content}}', content);

    writeFileSync(outputFilePath, output);

    indexOfPosts.push(outputFilePath);

    if (!runningTests) {
        console.log('\nBuilt: ' + outputFilePath + '\n');
    }
}

function getAnchorText(item) {
    const matches = item.match(/\.\/docs\/(.+)\.html/)

    if (matches) {
        return matches[1].charAt(0).toUpperCase() + matches[1].substring(1);
    }

    return item;
}

function getParsedContent(fileContent) {
    const numOfSpaces = 4;
    const lines = fileContent.split('\n');
    const parsedLines = lines.map(line => {
        // If empty string return, we don't want unnecessary p tag
        if (typeof line === 'string' && !line) {
            return line;
        }

        // Parse sections

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

function getUrl(item) {
    return item.replace('docs/', '');
}