import BasicProperties from "../properties/basic_properties";
import TilesetProperties from "../properties/tileset_properties";
import { cloneDeep } from "lodash";

export default class TiledMapParsedResult {
    constructor (
        private readonly layerIdToPropertiesMap: ReadonlyMap<number, BasicProperties>,
        private readonly objectIdToPropertiesMap: ReadonlyMap<number, BasicProperties>,
        private readonly tilesetIdToPropertiesMap: ReadonlyMap<number, TilesetProperties>
    ) {
    }

    /**
     * Gets a copy of the objectIdToObjectMap.
     */
    public getObjectIdToPropertiesMap (): ReadonlyMap<number, BasicProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, BasicProperties> = new Map(
            Array.from(this.objectIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a copy of the layerIdToPropertiesMap.
     */
    public getLayerIdToPropertiesMap (): ReadonlyMap<number, BasicProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, BasicProperties> = new Map(
            Array.from(this.layerIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a copy of the tilesetIdToPropertiesMap.
     */
    public getTilesetIdToPropertiesMap (): ReadonlyMap<number, TilesetProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, TilesetProperties> = new Map(
            Array.from(this.tilesetIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a JSON of the parsed result.
     * 
     * The JSON contains three distinct sections:
     * - layers: A map of layer id to properties.
     * - objects: A map of object id to properties.
     * - tilesets: A map of tileset firstgid to properties.
     */
    public toJSON (): any {
        // Recursively build the JSON object, converting sets to arrays and maps to objects.
        const convertToJson = (object: any): any => {
            if (object instanceof Set) {
                return Array.from(object.values()).map(convertToJson);
            } else if (object instanceof Map) {
                return Object.fromEntries(
                    Array.from(object.entries()).map(([key, value]) => [key, convertToJson(value)])
                );
            } else if (typeof object === 'object') {
                const newObject: any = {};

                Object.entries(object).forEach(([key, value]) => {
                    newObject[key] = convertToJson(value);
                });

                return newObject;
            } else {
                return object;
            }
        };

        return JSON.stringify({
            layers: convertToJson(this.getLayerIdToPropertiesMap()),
            objects: convertToJson(this.getObjectIdToPropertiesMap()),
            tilesets: convertToJson(this.getTilesetIdToPropertiesMap())
        }, null, 4);
    }
}
