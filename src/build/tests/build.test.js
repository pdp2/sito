import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';

const template = readFileSync('./src/templates/page.template.html', { encoding: 'utf-8' });
const pageSnapshot = readFileSync('./src/build/tests/page.snapshot.html', { encoding: 'utf-8' });
const postSnapshot = readFileSync('./src/build/tests/post.snapshot.html', { encoding: 'utf-8' });

jest.unstable_mockModule('node:fs', () => ({
    writeFileSync: jest.fn(),
    readFileSync: jest.fn((filePath) => {
        if (filePath === './posts/test.md') {
            return '# A test headline for a post\nSomething to say? Write it on this post!';
        }
        else if (filePath === './src/templates/page.template.html') {
            return template;
        }
    }),
    readdirSync: jest.fn()
}));

const { writeFileSync } = await import('node:fs');
const { build } = await import('#src/build/index.js');

beforeEach(() => {
    jest.clearAllMocks();
});


test('When building a post; the resulting file should be written in the correct location', () => {
    build('./posts/test.md');
    expect(writeFileSync.mock.calls[0][0]).toBe('./docs/test.html');
});

test('The built post output should match the snapshot', () => {
    build('./posts/test.md');
    expect(writeFileSync.mock.calls[0][1]).toBe(postSnapshot);
});

