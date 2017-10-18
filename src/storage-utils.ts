export function getStorageItem(objectId: string): any {
    var jsonString = window.localStorage.getItem(objectId);

    if(!jsonString) {
        return undefined;
    }

    return JSON.parse(jsonString);
}

export function setStorageItem(objectId: string, value: any): void {
    var jsonString = JSON.stringify(value);

    window.localStorage.setItem(objectId, jsonString);
}