# vue-whale-extension-boilerplate

Boilerplate for Whale extension using Vue.js and Webpack with Hot Reloading Enabled.
This boilerplate is only use for sideber application.

## Usage

```json
// after clone this respository

npm install

```

## Scripts

```json
// build extension and watch for changes
npm run watch

// build extension zip
npm run build

// lint all source files
npm run lint
```

## HEADS UP

Before production need to remove hot reloaded codes. It is in `src/background/index.js`
and `src/sidebar/index.js` that wrapped around with comments.

### reference

[mubaidr](https://github.com/mubaidr/vue-chrome-extension-boilerplate#contributors)
