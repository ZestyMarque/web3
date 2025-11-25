
export function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
