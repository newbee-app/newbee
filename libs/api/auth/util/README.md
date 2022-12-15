# api-auth-util

This lib contains useful backend utilities for authentication and authorization. It includes things like:

- Interfaces
- Constant values
- Example instances of defined classes/interfaces for use in testing
- Nest Passport auth guards

## What to add to this lib

Like other `api-auth` libs, everything in this lib should only be inteded for the backend and for use in authentication/authorization.

Like other `util` libs, this lib should only contain basic utility classes, interfaces, and functions that do not affect state.

## Where can this lib be imported

Like other `api` libs, this lib can be used in any other backend lib.

Like other `util` libs, this lib can be used by any other lib type (i.e. `data-access`, `feature`, or `util`).

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `api-shared` or `shared` libs, when it makes sense.
