import { parseHeadings } from "./parseHeadings.js";

test('Parse h1 level headings', () => {
    expect(parseHeadings('# An example heading')).toBe('<h1>An example heading</h1>');
});