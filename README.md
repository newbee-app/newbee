# NewBee

## Description

NewBee makes use of Nx to handle the complexities of running an enterprise-level monorepo. For all intents and purposes, NewBee projects try to stick with canonical Nx structure and Nx recommendations.

NewBee is powered by Nest in the backend and Angular in the frontend, both of which maintain first-level support status with Nx. The combination of Nx, Nest, and Angular was made for a couple of reasons.

1. They are all opinionated tools (with reasonable opinions) with clear guidelines and recommendations, which drastically cuts down on decision fatigue.
2. They are all powerful, and come with loads of first-class plugins that allow them to meet most use-cases out-of-the-box.
3. They are all inspired by each other (Angular was created by and is maintained by Google, Nx was created by a former Google engineer and is based off of Google's proprietary monorepo management tools, Nest is heavily inspired by Angular and follows its conventions), meaning the tools have a high degree of first-class support for each other and maintain compatible philosophies.
4. They are all well-maintained projects with great documentation and robust developer communities.

> The official Nx docs: <https://nx.dev/getting-started/intro>  
> The official Nest docs: <https://docs.nestjs.com/>  
> The official Angular docs: <https://angular.io/docs>

## Setup

In order to clone NewBee and get it up and running (in the recommended way), you'll need:

- Git
- [Docker Desktop](https://docs.docker.com/get-docker/)
- A code edtior (we recommend [Visual Studio Code](https://code.visualstudio.com/download))

For the purposes of running NewBee for development, the recommendation is to use:

- Docker containers to run Postgres, Solr, and Zookeeper
- A [VS Code dev container](https://code.visualstudio.com/docs/devcontainers/containers) to run the project itself
- The provided `docker-compose.dep.yaml` and `setup.sh` files to simplify the setup process

However, if you prefer, you can forego using the VS Code dev container. If you decide to do so, the setup looks very similar, but you will need a local copy of a compatible version of Node and NPM (>=18.12.1 and >=8.19.2, respectively) on your machine. While the official recommendation is to use a dev container to simplify the setup and development environment, using a local copy of Node and NPM will result in much faster builds than using the dev container, so neither approach is without its pros and cons.

> **_Special note for Windows users:_** If you're on Microsoft Windows, we'd recommend making use of [WSL](https://learn.microsoft.com/en-us/training/modules/wsl/wsl-introduction/) to do the rest of the steps outlined in this section. When setting up Docker Desktop, you should be using `Docker Desktop for Windows` but [configure it to use WSL](https://docs.docker.com/desktop/windows/wsl/). If you're installing Docker Desktop for the first time, it should be enough to ensure the recommended option to use WSL is checked during the installation steps. If you decide to develop using VS Code (as recommended), you can check out this guide about [how to use VS Code in your WSL environment](https://code.visualstudio.com/docs/remote/wsl). The rest of the guide presumes you are in your WSL environment.

### Cloning the repo from GitHub

First, you will need to clone [the repo from GitHub](https://github.com/newbee-app/newbee). For example:

```bash
~/git > git clone git@github.com:newbee-app/newbee.git
```

If you're using a Mac, we would recommend [setting up GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

For Linux and WSL users, we would recommend using [GitHub CLI](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git) to remember your credentials and working with GitHub through HTTPS (and not SSH), so you don't have to type in your password every time you take an action that affects the remote. Although you can also use SSH to achieve the same effect, using GitHub CLI will be easier if you decide to take the recommended route of setting up the project with a VS Code dev container. If you use SSH, you can still use a VS Code dev container, but it will require additional work on your part. For Macs, this isn't really a concern.

### Setting up with a VS Code Dev Container

While you do not need to use VS Code to work in this project, it's a free and open source option that we'd recommend. Using VS code will also slightly simplify the rest of the setup steps. If you do decide to work on this repo in VS Code, you will need the the following extensions:

- `Dev Containers` by Microsoft
- `WSL` by Microsoft (for Windows users)

> **_Sepcial note for Windows users:_** Make sure you are working in VS Code using WSL. To do so, bring up the Command Palette by pressing `Ctrl+Shift+P` and enter `WSL: Connect to WSL`.

Once you have both extensions installed, bring up the Command Palette by pressing `Cmd+Shift+P` and enter `Dev Containers: Open Folder in Container...`. Choose the fresh clone of NewBee as the folder and you should now be running the project on VS Code in a dev container! The dev container runs the project in a fresh Ubuntu image that has the NewBee project volume mounted onto it. Your VS Code GUI connects to a VS Code Server running on the dev container, allowing you to utilize the VS Code GUI while isolating all of your actual development to the dev container! This allows us to do things like forego installing a local version of Node and NPM, as these dependencies will be installed in the dev container instead. Additionally, thanks to the volume mount, any changes you make in the dev container will be reflected in the file system of your local machine.

Once the dev container is completely set up and all of the VS Code extensions attached to the container have been installed, reload the window by bringing up the Command Palette (`Cmd+Shift+P`) and enter `Developer: Reload Window`. **This is a critical step**. Failure to do this can lead to issues with the next few steps.

> **_Special note for Linux and WSL users:_** If you recall, we recommended that you clone the repo via HTTPS and use GitHub CLI to remember your credentials. If you're set up to use SSH and don't want to use GitHub CLI, you will need to [take some extra steps to share your SSH key with your dev container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials). Otherwise, you will need to ensure you are in your local environment to make commits to the remote.

### Setting up without a VS Code dev container

Whether or not you're using VS Code, you may not want to make use of dev containers. If this is the case, you will need to install a compatible version of Node and NPM locally. As stated in the `package.json` file, you must have have a version of NPM `>=8.19.2` and a version of Node `>=18.12.1`. You can check the version of NPM and Node installed on your own machine by doing the following:

```bash
~/ > node -v
v18.12.1
~/ > npm -v
8.19.2
```

If you do not have a compatible version of NPM and Node, you will need to install it. For that, we would personally recommend [NVM](https://github.com/nvm-sh/nvm). However, feel free to use whatever tool you wish to get a compatible version of NPM and Node, including the [official install link](https://nodejs.org/en/download).

### Using the setup.sh script

With that minimal amount of setup out of the way, we recommend using the `setup.sh` script provided at the project's root to get everything ready for development. You should do this whether or not you're running the project inside a dev container. To do so, just run:

```bash
~/git/newbee > . ./setup.sh
```

The setup script will handle:

- Installing NPM dependencies
- Generating the env file the project requires
- Starting up the Docker containers running Postgres, Solr, and Zookeeper using Docker Compose
- Running Postgres migrations to prepare the Postgres instance for use with NewBee
- Setting up authentication for Solr and Zookeeper
- Setting up Solr for use with NewBee

The script will skip installing NPM dependencies if it detects your project already has a `node_modules` folder and will skip generating the env file if your project already has a `.env` file.

To get all functionality up and running, however, there is one extra step you will need to take manually after running the `setup.sh` script.

### Setting up SMTP

The following step is overall optional, but necessary if you want to enable magic link login, which is when NewBee sends users a link in their email to log in to the app. You will need to set up SMTP with the email address you want to use to send these type of emails. There are [several guides online](https://kinsta.com/blog/gmail-smtp-server/) for how to do this on popular platforms like Gmail. In terms of the information you'll need, jot down the following:

1. The SMTP host
   - e.g. `smtp.example.com`
2. The SMTP username
   - Unless you're setting up SMTP with a service like Amazon SES for an entire domain, this will most likely be your email address
   - e.g. `johndoe@example.com`
3. The password
4. The email address that should appear on the `from` field
   - Unless you're setting up SMTP with a service like Amazon SES for an entire domain, this will most likely be the same as username
   - e.g. `johndoe@example.com`

Once you have that information, fill in the corresponding fields in the `.env` file generated by the `setup.sh` script. The variables you need to change are at the very top, under a comment that should make it pretty clear which variables you need to change.

### Running an instance of NewBee

To work with this project and execute common tasks like running tests, building the app, or serving the app for development use, we highly recommend making use of VS Code's Nx Console extension. Once you have it installed, it should appear on the VS Code toolbar with a symbol containing an `N`. Once there, look under `GENERATE & RUN TARGET` and you should see options like `generate`, `build`, `serve`, `lint`, and `test`. This is a very convenient tool that should greatly bolster your productivity and justifies the decision to incorporate Nx into the project. However, if you prefer, you can also run each of these commands on the command line.

To set up the backend using the command line, go to the repo's root and run the following command:

```bash
~/git/newbee > npx nx run api:serve
```

To set up the frontend using the command line, go to the repo's root and run the following command:

```bash
~/git/newbee > npx nx run newbee:serve-ssr
```

For more info on how to use Nx commands, check out the [Nx docs](https://nx.dev/getting-started/intro).

## The TypeScript configuration

> The official docs for how to structure a tsconfig.json file: <https://www.typescriptlang.org/tsconfig>

NewBee makes use of TypeScript, as opposed to vanilla JavaScript, in order to: catch errors before runtime, make the code clearer, and allow for better maintainability as new contributors are tasked with adding to and maintaining the codebase. In order to do this, we make use of tsconfig.json files in all of our TS projects. These project-specific tsconfig.json files inherit from the tsconfig.base.json file that exists in the root dir. When picking out the settings that would go into the base config, choices were made to focus on:

1. Catching as many bugs as possible at compile time.
2. Forcing developers to keep to a defined and predictable standard.
3. Complying with conventional JavaScript and TypeScript conventions.
4. Keeping the compiled JavaScript files as small and optimized as possible for use in production deployment.
5. Giving developers flexibility that does not come at the cost of any of the above points.

As specified in the docs, some options in the tsconfig.base.json file also affect other options. For such options, the root tsconfig.base.json file tries to specify as few lines as possible, meaning "child" options are not specified unless they should explicitly differ from their "parent" option. The following are all of the "parent" options specified in the base file and the "child" options associated with them which were not explicitly changed:

- `strict`
  - `alwaysStrict`
  - `strictNullChecks`
  - `strictBindCallApply`
  - `strictFunctionTypes`
  - `strictPropertyInitialization`
  - `noImplicitAny`
  - `noImplicitThis`
  - `useUnknownInCatchVariables`
- `esModuleInterop`
  - `allowSyntheticDefaultImports`
- `target`
  - `useDefineForClassFields`

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
- All projects in this monorepo make use of `compodoc` to transform `jsdoc` comments into pretty, human-readable web pages. All contributors to this project should update `jsdoc` comments whenever they make changes to existing documented code, create `jsdoc` comments for existing undocumented code (if encountered), and add `jsdoc` comments to all new code they write. `compodoc` web pages can be viewed using the `compodoc` task provided by `@twittwer/compodoc`, a third-party Nx plugin. Remember to pass in the `--serve` flag.
- When adding new packages for use in the repo, it's important not to violate the license of the packages we're using. As NewBee uses the MIT license and does not want to use another type of license, it's important to ensure that all packages used in the project are under permissive licenses (e.g. `MIT`, `ISC`, `Apache`) and not copyleft licenses (e.g. `GPL`, `AGPL`, `LGPL`),as copyleft licenses require packages that use them to use the same license that they use. You can make use of the `license-checker` package to check the license of any package in the repo, or any package you might want to add to the repo.
- While it's okay for the backend Nest project to make use of CJS packages, the frontend Angular project should only use ESM packages to ensure the Angular builder can properly tree-shake any unused portions of imported dependencies. While the Angular builder should give you warnings when you make use of a CJS module on the frontend, you should use the `agadoo` package to preemptively check that any package you use on the frontend is in ESM format.
- When defining a new dir to store files, prefer creating an `index.ts` file for each dir, which exports all of the files of the dir that can be used outside of that dir. When importing files from the dir, prefer importing the dir itself through the index file rather than importing specific files from the dir.
- When defining entities, mark all relations as hidden properties using `hidden: true`. This makes it easier to work with the plain interfaces that entity classes should inherit from. If you need to pass in a populated relation from the backend to the frontend, define a DTO that explicitly passes the relation separately.
- When creating libs, prefer singular over plural nouns.
  - e.g. Use `interface` instead of `interfaces`.
- If you want to register a new module-specific config to be fed into Nest's `ConfigService`, define it in `api-shared-util`. This is to ensure that the main app's config interface can specify the module-specific config interface as an optional property. Doing so allows us to access the whole of the config service's properties with strong type inferencing.
- When using the `createFeature` function from the `NgRx` library, avoid feeding in any generic arguments. Doing so forces you to feed in a value to `Store` when injecting it with DI, which is prohbitied via the linter.
- Some NPM packages that make use of ESM throw errors when used with Jest. These errors will basically complain of an unknown syntax and show you an ESM `export` or `import` statement. The most prominent occurence is `lodash-es`, which we get around in the global `jest.preset.js` file by mapping the module to `lodash`, which doesn't have issues as it uses CJS syntax. For other modules that don't have a CJS equivalent, you can change the `transformIgnorePatterns` of the problematic library's `jest.config.ts` file to include the package that's throwing the error. For example, `'node_modules/(?!.*\\.mjs|@simplewebauthn/browser)'`.
- As types and interfaces are removed from TS when transpiled to JS, all such imports should make use of `import type` as opposed to the regular `import`.
