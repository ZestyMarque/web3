export function deepCopy(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.map(row => Array.isArray(row) ? [...row] : row);
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
