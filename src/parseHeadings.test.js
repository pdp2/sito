const parseHeading = require('./parseHeadings');

test('return h1', () => {
    expect(parseHeading('# An example heading')).toBe('<h1>An example heading</h1>');
});