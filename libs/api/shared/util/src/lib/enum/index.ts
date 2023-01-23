/**
 * The strings associated with each component of CRUD, to be used with `accesscontrol`.
 */
export enum CRUD {
  C = 'create',
  R = 'read',
  U = 'update',
  D = 'delete',
}

/**
 * The strings associated with the possession component of an `accesscontrol` action.
 */
export enum Possession {
  Any = 'any',
  Own = 'own',
}
