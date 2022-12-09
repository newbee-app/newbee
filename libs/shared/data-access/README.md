# shared-data-access

This lib contains useful utilities for interacting with data that are shared between the backend Nest project and the frontend Angular project. It includes things like:

- DTOs (i.e. Data Transfer Objects)
- Constant values
- Example instances of defined classes/interfaces for use in testing.

## What to add to this lib

Like other `data-access` libs, `shared-data-access` should only contain classes, interfaces, and functions that work with state in some way.

## Where can this lib be imported

Like other `shared` libs, this lib can be used on the back- or front-ends.

Like other `data-access` libs, this lib can only be used by other `data-access` libs or `feature` libs;

## Things to watch out for

As everything in this lib can be used on the frontend, make sure you only use ESM packages to allow Angular to properly tree-shake any unused portions of dependencies.
