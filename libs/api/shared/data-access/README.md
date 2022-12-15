# api-shared-data-access

This lib contains useful backend utilities for interacting with data. It includes things like:

- All of the app's MikroORM entities
- Example instances of defined classes/interfaces for use in testing

## What to add to this lib

Like other `api-shared` libs, everything in this lib should only be intended for the backend for use in other backend libs.

Like other `data-access` libs, this lib should only contain classes, interfaces, and functions that work with state in some way.

## Where can this lib be imported

Like other `api` libs, this lib can be used in any other backend lib.

Like other `data-access` libs, this lib can only be used by other `data-access` libs or `feature` libs.

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `api-shared` or `shared` libs, when it makes sense.

## Notes

### Why are all of the entity files defined here?

Entity files must all be defined within the same lib as it's possible for them to import and reference each other in bi-directional relations. While this is fine if the files are isolated to the same lib, it causes circular dependency issues if the entity files are defined in their own individual libs. If all of the entity files had to be defined in the same lib, it made the most sense to put them in this one.
