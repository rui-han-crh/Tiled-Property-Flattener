import type BasicProperties from '../basic_properties.js';
import { type Flattener } from './flattener.js';

export default class TiledProjectParsedResult {
    constructor (
        private readonly flattener: Flattener
    ) {}

    /**
     * Flattens the properties of a Tiled object/layer.
     *
     * This will overwrite the properties of the parent class with the properties of the object.
     *
     * @param object The object to flatten the properties of.
     * @returns An object literal of the flattened properties,
     *  mapping the property key to the property value.
     */
    public flattenPropertiesOnObject (object: any): BasicProperties {
        if (object.id === 4) {
            console.log(object);
            console.log({
                // The parent class is called `class` in layers, but `type` in objects.
                // Layers also have a `type` property, but it is irrelevant to us.
                // Objects do not have a `class` property, so it falls through to `type`.
                ...this.flattener.memoisedFlattenedProperties.get(object.class ?? object.type),
                ...object.properties?.reduce((acc: any, property: any) => (
                    { ...acc, ...this.flattener.flattenMemberProperty(property) }
                ), {}),
                name: object.name,
                id: object.id,
                x: object.x,
                y: object.y
            });
        }
        return {
            // The parent class is called `class` in layers, but `type` in objects.
            // Layers also have a `type` property, but it is irrelevant to us.
            // Objects do not have a `class` property, so it falls through to `type`.
            ...this.flattener.memoisedFlattenedProperties.get(object.class ?? object.type),
            ...object.properties?.reduce((acc: any, property: any) => (
                { ...acc, ...this.flattener.flattenMemberProperty(property) }
            ), {}),
            name: object.name,
            id: object.id,
            x: object.x,
            y: object.y
        };
    }
}
