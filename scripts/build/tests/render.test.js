import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';

const template = readFileSync('./src/templates/page.template.html', { encoding: 'utf-8' });
const pageSnapshot = readFileSync('./scripts/build/tests/page.snapshot.html', { encoding: 'utf-8' });
const postSnapshot = readFileSync('./scripts/build/tests/post.snapshot.html', { encoding: 'utf-8' });

jest.unstable_mockModule('node:fs', () => ({
    writeFileSync: jest.fn(),
    readFileSync: jest.fn((filePath) => {
        if (filePath === './posts/test.md') {
            return '# A test headline for a post\nSomething to say? Write it on this post!';
        }
        else if (filePath === './pages/test.md') {
            return '# A test headline for a page\nSomething to say? Write it on this page!';
        }
        else if (filePath === './src/templates/page.template.html') {
            return template;
        }
    }),
    readdirSync: jest.fn()
}));

const { writeFileSync } = await import('node:fs');
const { render } = await import('../render');

beforeEach(() => {
    jest.clearAllMocks();
});

test('When rendering a page; the resulting file should be written in the correct location', () => {
    render('./pages/test.md');
    expect(writeFileSync.mock.calls[0][0]).toBe('./docs/test.html');
});

test('When rendering a post; the resulting file should be written in the correct location', () => {
    render('./posts/test.md');
    expect(writeFileSync.mock.calls[0][0]).toBe('./docs/test.html');
});

test('The rendered page output should match the snapshot', () => {
    render('./pages/test.md');
    expect(writeFileSync.mock.calls[0][1]).toBe(pageSnapshot);
});

test('The rendered post output should match the snapshot', () => {
    render('./posts/test.md');
    expect(writeFileSync.mock.calls[0][1]).toBe(postSnapshot);
});

