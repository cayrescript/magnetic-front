const { test, expect } = require('@playwright/test');
const { expectedContentCSV, expectedContentJSON, expectedContentXML } = require("./mock");

function normalizeString(str) {
    const [header, ...lines] = str
        .replace(/[\n\r]+/g, '\n')
        .trim()
        .split('\n')
        .map(line => line.trim());

    const sortedLines = lines.sort((a, b) => {
        if (a === header) return -1;
        if (b === header) return 1;

        const [, , , , yearA, , idA] = a.split(',').map(item => parseInt(item));
        const [, , , , yearB, , idB] = b.split(',').map(item => parseInt(item));
        const [rankA] = a.split(',').map(item => parseInt(item));
        const [rankB] = b.split(',').map(item => parseInt(item));

        return yearA - yearB || rankA - rankB || idA - idB;
    });

    return [header, ...sortedLines]
        .join('\n')
        .replace(/\u00A0/g, ' ')
        .replace(/"/g, '');
}

test.describe('Data Export Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('export filtered and sorted data in various formats', async ({ page }) => {
        await applyFiltersAndSorting(page);

        await page.click('#data-export-button');

        const formats = ['CSV', 'JSON', 'XML'];

        for (const format of formats) {
            await page.selectOption('#export-format-select', format);
            page.click('#data-export-button');

            const downloadPromise = page.waitForEvent('download');
            const download = await downloadPromise;

            expect(download).toBeTruthy();
        }
    });
});

async function applyFiltersAndSorting(page) {
    await page.fill('#filter-input', 'Ichiro');
    await page.click('#sort-rank');
}

async function verifyExportedFile(download, format) {
    const path = `./temp/downloadedFile.${format.toLowerCase()}`;
    await download.saveAs(path);

    const content = await require('fs').promises.readFile(path, 'utf-8');
    let expectedContent;
    let actualContent;

    switch (format) {
        case 'CSV':
            expectedContent = normalizeString(expectedContentCSV);
            actualContent = normalizeString(content);
            break;
        case 'JSON':
            expectedContent = JSON.stringify(JSON.parse(expectedContentJSON), null, 2);
            actualContent = JSON.stringify(JSON.parse(content), null, 2);
            break;
        case 'XML':
            expectedContent = expectedContentXML.replace(/[\n\r]+/g, '\n').trim();
            actualContent = content.replace(/[\n\r]+/g, '\n').trim();
            break;
    }

    const expectedLines = expectedContent.split('\n');
    const actualLines = actualContent.split('\n');

    return expectedLines.every(line => actualLines.includes(line));
}