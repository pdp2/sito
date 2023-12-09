import { inTagRegExp } from '#src/regexp.js';
export function parseParagraphs(string) {
    if (isParagraph(string)) {
        return '<p>' + string + '</p>';
    }

    return string;
}

function isParagraph(string) {
    return !inTagRegExp.test(string);
}