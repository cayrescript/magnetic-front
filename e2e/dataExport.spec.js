const { test, expect } = require('@playwright/test');

test.describe('Data Export Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
        await applyFiltersAndSorting(page);
    });

    test('export filtered and sorted data in CSV format', async ({ page }) => {
        await testExportFormat(page, 'CSV');
    });

    test('export filtered and sorted data in JSON format', async ({ page }) => {
        await testExportFormat(page, 'JSON');
    });

    test('export filtered and sorted data in XML format', async ({ page }) => {
        await testExportFormat(page, 'XML');
    });
});

async function applyFiltersAndSorting(page) {
    await page.fill('#filter-input', 'Ichiro');
    await page.click('#sort-rank');
}

async function testExportFormat(page, format) {
    await page.selectOption('#export-format-select', format);
    await page.click('#data-export-button');
    // Aumente o tempo limite para aguardar o evento de download, se necessário
    const download = await page.waitForEvent('download', { timeout: 20000 });
    expect(download).toBeTruthy();
}
