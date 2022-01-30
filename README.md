# transform-docs
Package to transform Svelte docs to JSON fromat, friendly for API server.


## Usage

Install in your project directory with command: `npm install -D https://github.com/sveltejs-translations/transform-docs`.

Module exports the `transform` method, which requre two arguments:
1. `files` - path to directory where documentation folders are stored
2. `project` - docs namespace

Code example:

```javascript
const {transform} = require("transform-docs");
const json = await transform('content/docs', 'svelte');
```


## Update module

1. Run `npm run build` to fetch latest sources from `sveltejs/action-deploy-docs` repo and build `transform-docs` module.
2. Run `npm version patch` and push commit to update package in the repo