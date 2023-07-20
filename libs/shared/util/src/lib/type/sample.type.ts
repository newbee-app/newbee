/**
 * Used to describe a few sample instances of a type and show the total number of instances there are.
 * Useful for instances where there may be too many instances to display at once.
 */
export type Sample<Type> = {
  /**
   * A few sample instances of the type.
   */
  sample: Type[];

  /**
   * The toal number of instances that exist.
   */
  total: number;
};
