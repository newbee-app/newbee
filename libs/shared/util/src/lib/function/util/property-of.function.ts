// Code taken from: https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names

/**
 * Get the property name of an object type.
 *
 * @param name The name of the property to get.
 *
 * @returns The name as a string.
 */
export function propertyOf<Type>(name: keyof Type): string | number | symbol {
  return name;
}

/**
 * Creates an object whose properties are the properties of the fed-in type, and whose values match the property name.
 *
 * NOTE that any object created using this function will not behave as expected when it comes to `Object` functions (e.g. `Object.entries`) or property checks (e.g. `'a' in obj`).
 *
 * @returns An object whose key-value pairs are the names of the type's properties.
 */
export function proxiedPropertiesOf<Type>() {
  return new Proxy(
    {},
    {
      get: (_, property) => property,
    },
  ) as { [Property in keyof Required<Type>]: Property };
}
