import { parseHeadings } from "./parseHeadings.js";

test('return h1', () => {
    expect(parseHeadings('# An example heading')).toBe('<h1>An example heading</h1>');
});