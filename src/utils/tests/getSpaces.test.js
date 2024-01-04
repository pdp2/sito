import { getSpaces } from "#src/utils/getSpaces.js";

test('Get spaces when a valid argument is passed', () => {
    expect(getSpaces('2')).toBe('  ');
    expect(getSpaces(4)).toBe('    ');
    expect(getSpaces(8)).toBe('        ');
});

test('Fail gracefully when an invalid argument is passed', () => {
    expect(getSpaces()).toBe('');
    expect(getSpaces(null)).toBe('');
    expect(getSpaces(undefined)).toBe('');
    expect(getSpaces(false)).toBe('');
});