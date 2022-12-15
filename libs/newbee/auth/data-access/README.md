# newbee-auth-data-access

This lib contains useful frontend utilities for interacting with data for authentication and authorization. It includes things like:

- Route guards that interact with Store
- Effects
- Reducers
- `AuthService`

## What to add to this lib

Like other `newbee-auth` libs, everything in this lib should only be intended for the frontend for use in authentication/authorization.

Like other `data-access` libs, this lib should only contain classes, interfaces, and functions that work with state in some way.

## Where can this lib be imported

Like other `newbee` libs, this lib can be used in any other frontend lib.

Like other `data-access` libs, this lib can only be used by other `data-access` libs or `feature` libs.

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `newbee-shared` or `shared` libs, when it makes sense.
