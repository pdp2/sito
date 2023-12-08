const h1RegExp = /#\s+(.+)/;

export function parseHeadings(string) {
    if (isHeading(string)) {
        return string.replace(h1RegExp, '<h1>$1</h1>');
    }
    
    return string;
}

function isHeading(string) {
    return h1RegExp.test(string);
}