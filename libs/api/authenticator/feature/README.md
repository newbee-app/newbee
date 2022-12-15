# api-authenticator-feature

This lib brings together all of the other libs needed for creating actual API endpoints for working with WebAuthn authenticators and bundles them into an exportable module. It includes things like:

- `AuthenticatorController`
- `AuthenticatorModule`

## What to add to this lib

Like other `api-authenticator` libs, everything in this lib should only be intended for the backend for use in working with authenticators.

Like other `feature` libs, this lib should only contain classes, interfaces, and functions meant to package other libs together to create functionality for the end-user.

## Where can this lib be imported

Like other `api` libs, this lib can be used in any other backend lib.

Like other `feature` libs, this lib can only be used by other `feature` libs.

## Things to watch out for

It's possible to create a circular dependency if you're not careful about the import heirarchy. To avoid that, try to abstract out the causes of the circular dependencies to either the `api-shared` or `shared` libs, when it makes sense.
