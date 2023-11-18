function parseHeadings(string) {
    const h1RegExp = /#\s+(.+)/;
    return string.replace(h1RegExp, '<h1>$1</h1>');
}

module.exports = parseHeadings;