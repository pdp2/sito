const fs = require('fs');
const parseHeadings = require('./src/parseHeadings')
const pageFolderPath = './pages/';
const pageFiles = fs.readdirSync(pageFolderPath);
const pageTemplate = fs.readFileSync('./src/templates/page.template.html', 'utf8');

pageFiles.forEach(fileName => {
    const content = getPageContent(fileName);
    const page = pageTemplate.replace('{{title}}', getPageTitle()).replace('{{content}}', content);

    fs.writeFile(`./docs/${fileName.replace('.md', '.html')}`, page, err => {
        if (err) {
            console.log(err);
        }
    });
});

function getPageContent(fileName) {
    const fileContents = fs.readFileSync(pageFolderPath + fileName, 'utf-8');

    return parseHeadings(fileContents);
}

function getPageTitle() {
    return 'A title...'
}