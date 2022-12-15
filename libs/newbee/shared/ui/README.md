# newbee-shared-ui

This lib contains dumb presentational components for general use. It includes things like:

- Dumb UI components
- Wrapper components for testing

## What to add to this lib

Like other `newbee-shared` libs, everything in this lib should only be intended for the frontend for use in other frontend libs.

Like other `ui` libs, this lib should only contain classes, interfaces, and functions that create dumb presentational components.

## Where can this lib be imported

Like other `newbee` libs, this lib can be used in any other frontend lib.

Like other `ui` libs, this lib can only be used by other `ui` libs or `feature` libs.

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `newbee-shared` or `shared` libs, when it makes sense.
