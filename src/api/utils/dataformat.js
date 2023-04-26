export function prepareData(data) {
    return data.map(item => {
        const newItem = {};
        Object.keys(item).forEach(key => {
            const newKey = key.toLowerCase();
            if (key === 'Rank') {
                return newItem[newKey] = item[key] > 0 ? parseInt(item[key], 10) : 0;
            }
            newItem[newKey] = item[key];
        });
        return newItem;
    });
}