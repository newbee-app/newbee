# newbee-shared-util

This lib contains useful frontend utilities general use. It includes things like:

- Interfaces
- Classes
- Directives
- Enums
- Helper functions
- Pipes
- Simple global services
- Validators
- Example instances of defined classes/interfaces for use in testing

## What to add to this lib

Like other `newbee-shared` libs, everything in this lib should only be inteded for the frontend and for use in other frontend libs.

Like other `util` libs, this lib should only contain basic utility classes, interfaces, and functions that do not affect state.

## Where can this lib be imported

Like other `newbee` libs, this lib can be used in any other frontend lib.

Like other `util` libs, this lib can be used by any other lib type (i.e. `data-access`, `feature`, or `util`).

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `newbee-shared` or `shared` libs, when it makes sense.
