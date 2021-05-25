
export class ObjectHelper {

    public static isObjectEmpty(obj: Record<string, any>): boolean {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    public static parseObjectToInventoryMap<T>(objectMap: any): Map<string, T> {
        const inventoryMap = new Map<string, T>();
        for (const containerName of Object.keys(objectMap)) {
            inventoryMap.set(containerName, JSON.parse(JSON.stringify(objectMap[containerName])));
        }
        return inventoryMap;
    }

    public static parseMapToObject(inventoryMap: Map<any, any>): any {
        const out = Object.create(null);
        inventoryMap.forEach((value, key) => {
            if (value instanceof Map) {
                out[key] = ObjectHelper.parseMapToObject(value);
            } else {
                out[key] = value;
            }
        });
        return out;
    }
}