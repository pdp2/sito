import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';

const template = readFileSync('./src/templates/page.template.html', { encoding: 'utf-8' });
const pageSnapshot = readFileSync('./scripts/build/tests/page.snapshot.html', { encoding: 'utf-8' });
const postSnapshot = readFileSync('./scripts/build/tests/post.snapshot.html', { encoding: 'utf-8' });

jest.unstable_mockModule('node:fs', () => ({
    writeFile: jest.fn(),
    readFileSync: jest.fn((filePath) => {
        if (filePath === './posts/test.html') {
            return 'A test headline for a post';
        }
        else if (filePath === './pages/test.html') {
            return 'A test headline for a page';
        }
        else if (filePath === './src/templates/page.template.html') {
            return template;
        }
    }),
    readdirSync: jest.fn()
}));

const { writeFile } = await import('node:fs');
const { render } = await import('../render');

test('Test', () => {
    render({fileName: 'test.html', type: 'page'});
    expect(writeFile.mock.calls[0][0]).toBe('./docs/test.html');
    expect(writeFile.mock.calls[0][1]).toBe(pageSnapshot);
});

test('Test', () => {
    render({fileName: 'test.html', type: 'post'});
    expect(writeFile.mock.calls[1][0]).toBe('./docs/blog/test.html');
    expect(writeFile.mock.calls[1][1]).toBe(postSnapshot);
});

