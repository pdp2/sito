import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { parseHeadings } from '#src/parser/parseHeadings.js';
import { parseParagraphs } from '#src/parser/parseParagraphs.js';
import { inTagRegExp, h1RegExp } from '#src/constants/regexp.js';
import { sections } from '#src/interpolator/sections.js';
import { getSpaces } from "#src/utils/getSpaces.js";

const runningTests = process.env.NODE_ENV === 'test';
let indexOfPosts = [];

if (!runningTests) {
    build();
}

export function build() {
    const postFolderPath = './posts/';
    const postFiles = readdirSync(postFolderPath) || [];
    const template = readFileSync('./src/templates/post.template.html', 'utf8');
    postFiles.forEach(fileName => buildPage(postFolderPath + fileName, template));

    const indexFilePath = './docs/index.html';
    const indexTemplate = readFileSync('./src/templates/index.template.html', 'utf8');
    buildPage(indexFilePath, indexTemplate, { isIndex: true });
}

export function isAlreadyInTag(string) {
    return inTagRegExp.test(string);
}

export function resetIndexCache() {
    indexOfPosts = [];
}

function buildPage(filePath, template, { isIndex } = {}) {
    const outputFilePath = isIndex ? filePath : getOutputFilePath(filePath);
    const fileContent = isIndex ? '' : readFileSync(filePath, 'utf-8');
    const content = isIndex ? '' : getParsedContent(fileContent);
    const links = getPageLinks(isIndex);
    let output = template
        .replace('{{title}}', getPageTitle(fileContent))
        .replace('{{content}}', content)
        .replace('<sito-styles></sito-styles>', getPageStyles())
        .replace('<sito-header></sito-header>', getPageHeader(links));

    writeFileSync(outputFilePath, output);

    indexOfPosts.push({
        path: outputFilePath,
        title: getPageTitle(fileContent).split(' | ')[0]
    });

    if (!runningTests) {
        console.log('\nBuilt: ' + outputFilePath + '\n');
    }
}

function getAnchorText(item) {
    return item.title;
}

function getPageHeader(links) {
    const template = readFileSync('./src/templates/components/header.template.html', 'utf8');
    // Format template to included indentations
    let output = template.replace(/\n+/g, `$&${getSpaces(4)}`);
    
    return output;
}

function getPageLinks(isIndex) {
    const links = indexOfPosts.map(item => ({url: getUrl(item), anchorText: getAnchorText(item)}))
    if (isIndex) {
        return links;
    }

    return [{
        anchorText: 'Home',
        url: '/'
    }];
}

function getPageStyles() {
    const globalStylesFile = readFileSync('./src/styles/global.css', 'utf8');
    return `<style id="global">\n${globalStylesFile}\n${getSpaces(4)}</style>`;
}

function getParsedContent(fileContent) {
    const numOfSpaces = 8;
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
    let title = 'Paolo Di Pasquale';
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

function getUrl(item) {
    return item.path.replace('docs/', '');
}