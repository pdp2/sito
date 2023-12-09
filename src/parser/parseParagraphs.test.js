import { parseParagraphs } from "#src/parser/parseParagraphs.js";

test('Parse paragraphs', () => {
    expect(parseParagraphs('Got something to say.')).toBe('<p>Got something to say.</p>');
});

test('If content is already in a tag then it should not wrap in a paragraph', () => {
    expect(parseParagraphs('<h1>I already have a tag</h1>')).toBe('<h1>I already have a tag</h1>');
});