/**
 * Acts similar to `Partial`, but instead of letting things be undefined it lets things be null.
 */
export type Nullable<Type> = {
  [Property in keyof Type]: Type[Property] | null;
};
