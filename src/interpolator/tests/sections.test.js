import { sections } from "#src/interpolator/sections.js";
import { readFileSync } from 'node:fs';

const sectionTemplate = readFileSync('./src/interpolator/tests/templates/section.template.html', { encoding: 'utf-8' });
const sectionSnapshot = readFileSync('./src/interpolator/tests/snapshots/section.snapshot.html', { encoding: 'utf-8' });
const data = [
    { title: 'Uno' },
    { title: 'Due' },
    { title: 'Tre' },
];

test('Interpolate sections', () => {
    expect(sections(sectionTemplate, { items: data })).toBe(sectionSnapshot);
});