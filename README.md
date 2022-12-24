# NewBee

## Description

This repo represents a monolith that encapsulates all of the TypeScript code written by NewBee LLC. NewBee makes use of Nx to handle the complexities of running an enterprise-level monorepo. For all intents and purposes, NewBee projects try to stick with canonical Nx structure and Nx recommendations.

Currently, the only project that NewBee LLC is developing is NewBee, an internal documentation app marketed towards businesses. NewBee is powered by Nest in the backend and Angular in the frontend, both of which maintain first-level support status with Nx. The combination of Nx, Nest, and Angular was made for a couple of reasons.

1. They are all opinionated tools (with reasonable opinions) with clear guidelines and recommendations, which drastically cuts down on decision fatigue.
2. They are all powerful, and come with loads of first-class plugins that allow them to meet most use-cases out-of-the-box.
3. They are all inspired by each other (Angular was created by and is maintained by Google, Nx was created by a former Google engineer and is based off of Google's proprietary monorepo management tools, Nest is heavily inspired by Angular and follows its conventions), meaning the tools have a high degree of first-class support for each other and maintain compatible philosophies.
4. They are all well-maintained projects with great documentation and robust developer communities.

> The official Nx docs: <https://nx.dev/getting-started/intro>  
> The official Nest docs: <https://docs.nestjs.com/>  
> The official Angular docs: <https://angular.io/docs>  

## The TypeScript configuration

> The official docs for how to structure a tsconfig.json file: <https://www.typescriptlang.org/tsconfig>

The JavaScript projects at NewBee LLC make use of TypeScript, as opposed to vanilla JavaScript, in order to: catch errors before runtime, make the code clearer, and allow for better maintainability as new contributors are tasked with adding to and maintaining the codebase. In order to do this, we make use of tsconfig.json files in all of our TS projects. These project-specific tsconfig.json files inherit from the tsconfig.base.json file that exists in the root dir. When picking out the settings that would go into the base config, choices were made to focus on:

1. Catching as many bugs as possible at compile time.
2. Forcing developers to keep to a defined and predictable standard.
3. Complying with conventional JavaScript and TypeScript conventions.
4. Keeping the compiled JavaScript files as small and optimized as possible for use in production deployment.
5. Giving developers flexibility that does not come at the cost of any of the above points.

As specified in the docs, some options in the tsconfig.base.json file also affect other options. For such options, the root tsconfig.base.json file tries to specify as few lines as possible, meaning "child" options are not specified unless they should explicitly differ from their "parent" option. The following are all of the "parent" options specified in the base file and the "child" options associated with them which were not explicitly changed:

- strict
  - alwaysStrict
  - strictNullChecks
  - strictBindCallApply
  - strictFunctionTypes
  - strictPropertyInitialization
  - noImplicitAny
  - noImplicitThis
  - useUnknownInCatchVariables
- esModuleInterop
  - allowSyntheticDefaultImports
- target
  - useDefineForClassFields

## Style guide

### Importing packages

While Prettier handles formatting code most of the time, it explicitly does not organize import statements because, "Prettier only prints code. It does not transform it." However, it's very annoying to have willy-nilly import statements, or import logic that makes sense to one developer but not to another. To simply everything, NewBee projects make use of the `prettier-plugin-organize-imports` package. It organizes import statements alphabetically, which is the convention we will follow.

## Opinionated language philosophies to follow

- Any scripting that needs to be done should be done in TypeScript.
- If any third-party packages are needed, stick with what's available in the TypeScript/JavaScript ecosystem.
- If performance becomes an issue and/or we need to build a tool that compiles down to web assembly, use Rust.
- For the sake of mobile development, use Dart as all moible development will be done using Flutter.

## Unorganized thoughts to organize later

- Code that does not and will never need to import from other `data-access`, `ui`, or `feature` libraries should be put in the `util` library associated with their corresponding feature.
- To avoid issues with barrel files and circular dependencies, put all entity files in the `api-shared-data-access` library.
- If you look at `apps/api/project.json`, you will notice that the `build` target has an option `"tsPlugins": ["@nestjs/swagger/plugin"]`. This opts-in to the Swagger plugin whenever the `api` app is built, automatically annotating the compiled output to include OpenAPI decorators. This allows us to get an informed view of the API through the Swagger UI without having to manually annotate the code. You can access this view by navigating to the URI for the API endpoint. While this is useful, it does not fully document all endpoints as some DTOs are provided by third-party packages, which Swagger cannot interpret.
- All projects in this monorepo make use of `compodoc` to transform `jsdoc` comments into pretty, human-readable web pages. All contributors to this project should update `jsdoc` comments whenever they make changes to existing documented code, create `jsdoc` comments for existing undocumented code (if encountered), and add `jsdoc` comments to all new code they write. `compodoc` web pages can be viewed using the `compodoc` task provided by `@twittwer/compodoc`, a third-party Nx plugin. Remember to pass in the `--serve` flag.
- When adding new packages for use in the repo, it's important not to violate the license of the packages we're using. As, for now, we are creating proprietary software, it's important to ensure that all packages used in the project are under permissive licenses (e.g. `MIT`, `ISC`, `Apache`) and not copyleft licenses (e.g. `GPL`, `AGPL`, `LGPL`). You can make use of the `license-checker` package to check the license of any package in the repo, or any package you might want to add to the repo.
- While it's okay for the backend Nest project to make use of CJS packages, the frontend Angular project should only use ESM packages to ensure the Angular builder can properly tree-shake any unused portions of imported dependencies. While the Angular builder should give you warnings when you make use of a CJS module on the frontend, you should use the `is-esm` package to preemptively check that any package you use on the frontend is in ESM format.
- When defining a new dir to store files, prefer creating an `index.ts` file for each dir, which exports all of the files of the dir that can be used outside of that dir. When importing files from the dir, prefer importing the dir itself through the index file rather than importing specific files from the dir.
- When defining entities, mark all relations as hidden properties using `hidden: true`. This makes it easier to work with the plain interfaces that entity classes should inherit from. If you need to pass in a populated relation from the backend to the frontend, define a DTO that explicitly passes the relation separately.
- When creating libs, prefer singular over plural nouns.
  - e.g. Use `interface` instead of `interfaces`.
- If you want to register a new module-specific config to be fed into Nest's `ConfigService`, define it in `api-shared-util`. This is to ensure that the main app's config interface can specify the module-specific config interface as an optional property. Doing so allows us to access the whole of the config service's properties with strong type inferencing.
- When using the `createFeature` function from the `NgRx` library, avoid feeding in any generic arguments. Doing so forces you to feed in a value to `Store` when injecting it with DI, which is prohbitied via the linter.
- Some NPM packages that make use of ESM throw errors when used with Jest. These errors will basically complain of an unknown syntax and show you an ESM `export` or `import` statement. The most prominent occurence is `lodash-es`, which we get around in the global `jest.preset.js` file by mapping the module to `lodash`, which doesn't have issues as it uses CJS syntax. For other modules that don't have a CJS equivalent, you can change the `transformIgnorePatterns` of the problematic library's `jest.config.ts` file to include the package that's throwing the error. For example, `'node_modules/(?!.*\\.mjs|@simplewebauthn/browser)'`.
