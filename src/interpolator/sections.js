export function sections(template, data) {
    const fields = Object.keys(data);
    let output = '';

    fields.forEach(field => {
        const fieldRegex = getSectionFieldRegex(field);
        const matches = template.match(fieldRegex);

        if (!matches) return;

        const entireMatch = matches[0];
        const captureGroup = matches[1];
        const fieldData = data[field];
        let captureGroupOutput = '';

        fieldData.forEach(item => {
            captureGroupOutput += interpolateString(captureGroup, item);
        });

        const trimmed = captureGroupOutput.trim();

        output = template.replace(entireMatch, trimmed);
    });

    return output;
}

function getSectionFieldRegex(field) {
    return new RegExp(`{{\\s*#${field}\\s*}}\\n(\\s*.+\\n)\\s*{{\\s*\\/${field}\\s*}}`);
}

function interpolateString(string, data) {
    const fields = Object.keys(data);
    let output = string;

    fields.forEach(item => {
        const regex = new RegExp(`{{${item}}}`);
        const matches = output.match(regex);

        if (!matches) return;

        output = output.replace(matches[0], data[item]);
    });

    return output;
}