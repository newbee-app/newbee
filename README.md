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

## Setting up from a fresh clone

This process is complicated and unintuitive, at the moment. In the long-term, the goal is to give users 2 options if they want to run NewBee on their own machines:

1. Binary executables available on all 3 major operating systems (Mac OS, Linux, and Windows).
2. A containerized version of the application.

For now, though, you will need to follow these complicated and annoying steps. We apologize in advance for the pain.

### Cloning the repo from GitHub

First, you will need to clone [the repo from GitHub](https://github.com/newbee-app/newbee). For example:

```bash
~/git > git clone git@github.com:newbee-app/newbee.git
```

The above code snippet makes use of SSH, which may not be configured for your specific GitHub account. If you're interested in setting that up, you can check the following resources that GitHub provides: <https://docs.github.com/en/authentication/connecting-to-github-with-ssh>

### Working with Node.js

In order to run the code in the repo, you must first ensure that you have a compatible version of Node.js and NPM. As stated in the `package.json` file, you must have have a version of NPM `>= 8.19.2` and a version of Node `>= 18.12.1`. You can check the version of NPM and Node installed on your own machine by doing the following:

```bash
~/ > node -v
v18.12.1
~/ > npm -v
8.19.2
```

If you do not have a compatible version of NPM and Node.js, you will need to install it. For that, we would personally recommend [NVM](https://github.com/nvm-sh/nvm). However, feel free to use whatever tool you wish to get a compatible version of NPM and Node.js.

Once you have a compatible version of Node.js and NPM installed, install all of the packages for the project by running the following:

```bash
~/git > cd newbee
~/git/newbee > npm i
```

### Installing non-NPM dependencies

NewBee makes use of Postgres as its primary database and Solr to implement search. If you want to run the backend portion of the app, you will need both.

#### Mac OS

If you are running Mac OS, this is easy to do using Homebrew.

```bash
~/ > brew install postgresql@14.7
~/ > brew install solr@9.1.1
```

From here, you will need to modify how Homebrew starts Solr. Do so by modifying the `.plist` file associated with Solr's Homebrew installation, which should be located in `/usr/local/Cellar/solr/9.1.1/homebrew.mxcl.solr.plist`. Change the portion under `ProgramArguments` to append the `-c` flag, which should look like the following:

```xml
<!-- homebrew.mxcl.solr.plist -->
<key>ProgramArguments</key>
<array>
  <string>/usr/local/opt/solr/bin/solr</string>
  <string>start</string>
  <string>-c</string> <!-- This is the new bit -->
  <string>-f</string>
  <string>-s</string>
  <string>/usr/local/var/lib/solr</string>
</array>
```

Finally, start it with:

```bash
~/ > brew services start postgresql@14
~/ > brew services start solr
```

#### Windows and Linux

- Follow the steps for installing Postgres here: <https://www.postgresql.org/download/>
- Follow the steps for installing Solr here: <https://solr.apache.org/downloads.html>

We recommend using version 14.7 for Postgres and version 9.1.1 for Solr. Once you have both installed, start them up. When starting Solr, ensure you start it in Cloud mode with the `-c` flag. The [following guide in the Solr docs](https://solr.apache.org/guide/solr/latest/getting-started/tutorial-five-minutes.html) discusses how to start up Solr under `Launch Solr in SolrCloud Mode`.

### Preparing Postgres

Now that you have a clean instance of Postgres running, we need to set up a new database within it that can be used by NewBee.

First things first, you must create a user that NewBee can use to interact with your Postgres instance. To do so, follow the steps in [this guide](https://phoenixnap.com/kb/postgres-create-user). Ensure this user has `CREATEDB` privileges.

Next, navigate to `tools/mikro-orm`.

```bash
~/git/newbee > cd tools/mikro-orm
```

In there, create a new `secret.ts` file, in which you should define the credentials for the user you just created.

```typescript
// secret.ts
export const user = 'newbee';
export const password = 'password';
```

Next, we'll run the necessary migrations to set up the database that NewBee needs.

```bash
~/git/newbee/tools/mikro-orm > npx mikro-orm migration:create --initial
~/git/newbee/tools/mikro-orm > npx mikro-orm migration:up
```

### Preparing Solr

Now that you have a clean instance of Solr running, we need to create the configs necessary for NewBee to work with it.

First things first, we need to set up authentication. Navigate to `tools/solr/auth`.

```bash
~/git/newbee > cd tools/solr/auth
```

#### Zookeeper ACLs

The first thing we'll do is set up an ACL (Access Control List) for Zookeeper, which Solr makes use of in Cloud mode to manage its resources. In the directory, create a file called `zookeeper-creds.json`. Inside it, specify the passwords you want to use for the admin user and readonly user for Zookeeper. We recommend using a password manager like [Bitwarden](https://bitwarden.com/) to generate and maintain these passwords for you. The file should look like the following:

```json
// zookeeper-creds.json
{
  "admin-user": "admin-password",
  "readonly-user": "readonly-password"
}
```

Next, we'll exeucte the `set-up-zookeeper-acl.ts` script. In order to do so, you need to know the following:

1. The command for stopping Solr.
    - For Mac OS, it might be: `brew services stop solr`
    - For Windows and Linux, it might be: `${SOLR_HOME}/bin/solr stop`
2. The command for starting Solr.
    - For Mac OS, it might be: `brew services start solr`
    - For Windows and Linux, it might be: `${SOLR_HOME}/bin/solr start -c`
3. The location of Solr's home directory.
    - For Mac OS, it might be: `/usr/local/Cellar/solr/9.1.1`
    - For Windows and Linux, it would be wherever you downloaded Solr to. If you didn't move it, it will probably be in your `Downloads` directory.

Once you know all of the information, feed it into the script and run it:

```bash
~/git/newbee/tools/solr/auth > npx ts-node set-up-zookeeper-acl.ts --stop "brew services stop solr" --start "brew services start solr" --solr-home /usr/local/Cellar/solr/9.1.1
```

#### Setting up basic authentication

To set up basic authentication for Solr, you must first create a password. Solr passwords must be specified in a very specific syntax, which is why we created the `basic-auth-pw.ts` script to convert a raw password into a format usable by Solr. When you know what you want your password to be, simply run:

```bash
~/git/newbee/tols/solr/auth > npx ts-node basic-auth-pw.ts generate "my-password"
```

Next, create a `security.json` file and make it look like the following:

```json
// security.json
{
  "authentication": {
    "class": "solr.BasicAuthPlugin",
    "blockUnknown": true,
    "forwardCredentials": false,
    "realm": "NewBee Solr",
    "credentials": {
      "your-username": "your-solr-formatted-password" // The output from `basic-auth-pw.ts`
    }
  }
}
```

Once that's set up, we will use the `set-up-basic-auth.ts` script to formally set up basic authentication like so:

```bash
~/git/newbee/tols/solr/auth > npx ts-node set-up-basic-auth.ts
```

#### Setting up the configs

Now that the authentication work is done, we can finally set up the configs needed to use Solr! Navigate to `tools/solr/configset` like so:

```bash
~/git/newbee > cd tools/solr/configset
```

Make use of the `configset.ts` script to set up the necessary configs, like so:

```bash
~/git/newbee/tools/solr/configset > npx ts-node configset.ts upload ./newbee-org-conf.zip --basic-auth "username:raw-password"
```

The username should be the username you specified in `security.json` and the password should be the raw password, not the Solr-formatted passwords.

### Setting up SMTP

The following step is necessary if you want to enable magic link login, which is when NewBee sends users a link in their email to log in to the app. You will need to set up SMTP with the email address you want to use to send these type of emails. There are [several guides online](https://kinsta.com/blog/gmail-smtp-server/) for how to do this on popular platforms like Gmail. In terms of the information you'll need, jot down the following:

1. The SMTP host
    - e.g. `smtp.example.com`
2. The SMTP username
    - Unless you're setting up SMTP with a service like Amazon SES for an entire domain, this will most likely be your email address
    - e.g. `johndoe@example.com`
3. The password
4. The email address that should appear on the `from` field
    - Unless you're setting up SMTP with a service like Amazon SES for an entire domain, this will most likely be the same as username
    - e.g. `johndoe@example.com`

### Setting up environment variables

There are a couple of environment variables you'll need to set up, which are omitted from version control for the sake of security.

To begin, create a `.env` file under `apps/api`. The required environment variables are detailed under `appEnvironmentVariablesSchema` under `libs/api/shared/util/src/lib/config/app.config.ts`. The `.env` file should look roughly like the following:

```bash
# .env
PORT="3333" # Optional, defaults to 3333 anyways

APP_NAME="NewBee"
APP_DOMAIN="localhost:3333" # Whatever port you used above, it should match here
APP_URL="http://localhost:3333" # Whatever port you used above, it should match here

POSTGRES_DB_NAME="newbee"
POSTGRES_USER="your-postgres-user" # Fill in with your own stuff here
POSTGRES_PASSWORD="your-postgress-pw" # Fill in with your own stuff here

JWT_SECRET="secret" # Make something up
COOKIE_SECRET="secret" # Make something up

MAGIC_LINK_LOGIN_VERIFY_LINK="http://localhost:4200/auth/login/magic-link-login"

SMTP_HOST="smtp.example.com" # Fill in with your own stuff here
SMTP_USERNAME="johndoe@example.com" # Fill in with your own stuff here
SMTP_PASSWORD="your-email-password" # Fill in with your own stuff here
SMTP_DEFAULT_FROM="johndoe@example.com" # Fill in with your own stuff here

SOLR_URL="http://127.0.0.1:8983" # This is the default for Solr, but you may need to change this if you didn't use default values
SOLR_USERNAME="username" # Fill in with your own stuff here
SOLR_PASSWORD="raw-password" # Fill in with your own stuff here
```

### Running an instance of NewBee

To set up the backend, go to the repo's root and run the following command:

```bash
~/git/newbee > npx nx run api:serve
```

To set up the frontend, go to the repo's root and run the following command:

```bash
~/git/newbee > npx nx run newbee:serve-ssr
```

Finally, you're all set! You must have pulled all the hairs on your head clean off. Sorry about that. We promise to make this easier later. Don't know when, though.

### Useful VS Code extensions for working with the code

We recommend the following extensions if you're working on this repo in VS Code:

- Angular Language Service
- Babel JavaScript
- ENV
- ESLint
- IntelliCode
- markdownlint
- npm Intellisense
- Nx Console
- Prettier
- Tailwind CSS IntelliSense

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
- While it's okay for the backend Nest project to make use of CJS packages, the frontend Angular project should only use ESM packages to ensure the Angular builder can properly tree-shake any unused portions of imported dependencies. While the Angular builder should give you warnings when you make use of a CJS module on the frontend, you should use the `is-esm` package to preemptively check that any package you use on the frontend is in ESM format.
- When defining a new dir to store files, prefer creating an `index.ts` file for each dir, which exports all of the files of the dir that can be used outside of that dir. When importing files from the dir, prefer importing the dir itself through the index file rather than importing specific files from the dir.
- When defining entities, mark all relations as hidden properties using `hidden: true`. This makes it easier to work with the plain interfaces that entity classes should inherit from. If you need to pass in a populated relation from the backend to the frontend, define a DTO that explicitly passes the relation separately.
- When creating libs, prefer singular over plural nouns.
  - e.g. Use `interface` instead of `interfaces`.
- If you want to register a new module-specific config to be fed into Nest's `ConfigService`, define it in `api-shared-util`. This is to ensure that the main app's config interface can specify the module-specific config interface as an optional property. Doing so allows us to access the whole of the config service's properties with strong type inferencing.
- When using the `createFeature` function from the `NgRx` library, avoid feeding in any generic arguments. Doing so forces you to feed in a value to `Store` when injecting it with DI, which is prohbitied via the linter.
- Some NPM packages that make use of ESM throw errors when used with Jest. These errors will basically complain of an unknown syntax and show you an ESM `export` or `import` statement. The most prominent occurence is `lodash-es`, which we get around in the global `jest.preset.js` file by mapping the module to `lodash`, which doesn't have issues as it uses CJS syntax. For other modules that don't have a CJS equivalent, you can change the `transformIgnorePatterns` of the problematic library's `jest.config.ts` file to include the package that's throwing the error. For example, `'node_modules/(?!.*\\.mjs|@simplewebauthn/browser)'`.
- As types and interfaces are removed from TS when transpiled to JS, all such imports should make use of `import type` as opposed to the regular `import`.
