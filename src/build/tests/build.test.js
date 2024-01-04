import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { getSpaces } from "#src/utils/getSpaces.js";

const indexTemplate = readFileSync('./src/templates/index.template.html', { encoding: 'utf-8' });
const postTemplate = readFileSync('./src/templates/post.template.html', { encoding: 'utf-8' });
const headerTemplate = readFileSync('./src/templates/components/header.template.html', { encoding: 'utf-8' });
const indexSnapshot = readFileSync('./src/build/tests/index.snapshot.html', { encoding: 'utf-8' });
const postSnapshot = readFileSync('./src/build/tests/post.snapshot.html', { encoding: 'utf-8' });

jest.unstable_mockModule('node:fs', () => ({
    writeFileSync: jest.fn(),
    readFileSync: jest.fn((filePath) => {
        if (filePath === './posts/lets-get-started.md') {
            return '# Let&apos;s get started\nWrite something here!';
        }
        else if (filePath === './posts/test.md') {
            return '# A test headline for a post\nSomething to say? Write it on this post!';
        }
        else if (filePath === './posts/another.md') {
            return '# A test headline for another post\nSomething to say? Write it on this post!';
        }
        else if (filePath === './src/templates/post.template.html') {
            return postTemplate;
        }
        else if (filePath === './src/templates/index.template.html') {
            return indexTemplate;
        }
        else if (filePath === './src/templates/components/header.template.html') {
            return headerTemplate;
        }
        else if (filePath === './src/styles/global.css') {
            return `${getSpaces(8)}body {\n${getSpaces(12)}font-family: sans-serif;\n${getSpaces(8)}}`;
        }
        else {
            throw new Error(filePath + ' was not found!');
        }
    }),
    readdirSync: jest.fn(() => {
        return ['lets-get-started.md', 'test.md', 'another.md'];
    })
}));

const { writeFileSync } = await import('node:fs');
const { build, resetIndexCache } = await import('#src/build/index.js');

beforeEach(() => {
    jest.clearAllMocks();
    resetIndexCache();
});


test('When building a post; the resulting file should be written in the correct location', () => {
    build();
    expect(writeFileSync.mock.calls[0][0]).toBe('./docs/lets-get-started.html');
});

test('The built post output should match the snapshot', () => {
    build();
    expect(writeFileSync.mock.calls[0][1]).toBe(postSnapshot);
});

test('A post should be built for each file in the posts folder', () => {
    build();
    expect(writeFileSync.mock.calls[0][0]).toBe('./docs/lets-get-started.html');
    expect(writeFileSync.mock.calls[1][0]).toBe('./docs/test.html');
    expect(writeFileSync.mock.calls[2][0]).toBe('./docs/another.html');
});

test('An index page should be built containing links to all the posts', () => {
    build();
    expect(writeFileSync.mock.calls[3][1]).toBe(indexSnapshot);
})
