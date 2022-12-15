# api-shared-util

This lib contains useful backend utilities for general use. It includes things like:

- Constant values
- Example instances of defined classes/interfaces for use in testing
- Global and module-specific configurations

## What to add to this lib

Like other `api-shared` libs, everything in this lib should only be inteded for the backend for use in other backend libs.

Like other `util` libs, this lib should only contain basic utility classes, interfaces, and functions that do not affect state.

## Where can this lib be imported

Like other `api` libs, this lib can be used in any other backend lib.

Like other `util` libs, this lib can be used by any other lib type (i.e. `data-access`, `feature`, or `util`).

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `api-shared` or `shared` libs, when it makes sense.

## Notes

### Config files

There are 2 types of configs: the global app-level config and module-specific configs. The app-level config should be accessible by any backend lib, but the module-specific configs should only be used within its specific module.

As the app-level config should be accessible by any backend lib, it makes sense for it to reside here. Module-specific configs should reside in that specific module's `util` lib.
