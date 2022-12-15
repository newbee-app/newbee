# shared-util

This lib contains useful utilities that are shared between the backend Nest project and the frontend Angular project. It includes things like:

- Interfaces
- Constant values
- Example instances of defined classes/interfaces for use in testing.

## What to add to this lib

Like other `shared` libs, everything in this lib should be inteded for use on both the backend and frontend.

Like other `util` libs, this lib should only contain basic utility classes, interfaces, and functions that do not affect state.

## Where can this lib be imported

Like other `shared` libs, this lib can be used on the back- or front-ends.

Like other `util` libs, this lib can be used by any other lib type (i.e. `data-access`, `feature`, `ui`, or `util`).

## Things to watch out for

As everything in this lib can be used on the frontend, make sure you only use ESM packages to allow Angular to properly tree-shake any unused portions of dependencies.
