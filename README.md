# Connect UI Toolkit

<a href="https://npmjs.com/package/@cloudblueconnect/connect-ui-toolkit"><img src="https://img.shields.io/npm/v/%40cloudblueconnect%2Fconnect-ui-toolkit?logo=npm" alt="NPM package"></a>
<a href="https://github.com/cloudblue/connect-ui-toolkit/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/cloudblue/connect-ui-toolkit/build.yml" alt="CI build"></a>
<a href="https://sonarcloud.io/summary/overall?id=connect-ui-toolkit"><img src="https://sonarcloud.io/api/project_badges/measure?project=connect-ui-toolkit&metric=alert_status" alt="Sonar Quality Gate"></a>
<a href="https://sonarcloud.io/summary/overall?id=connect-ui-toolkit"><img src="https://sonarcloud.io/api/project_badges/measure?project=connect-ui-toolkit&metric=coverage" alt="Sonar Test Coverage"></a>

---

Build your Connect Extension UI easily with our UI Toolkit. Feel free to use any frontend library
or framework you prefer!

## Installation

### Minimalistic via CDN

Just plug a module via `script` tag, import default exported function and call it. You're good.

N.B.: For development mode - by default `<path>` will be `http://localhost:3003`

```html
<script type="module">
  import createApp from '<path>';

  createApp();
</script>
```

This will implement minimalistic interaction with parent Connect Application.

## Usage

### Use widgets

1. Import required widget from named exports
2. Pass a configuration Object to `createApp` function as an argument
3. Configuration object should contain desired tag name as a `key` and widget descriptor object as a `value`. N.B.: widget name should contain at least one "-"

```html
<script type="module">
  import createApp, { Card } from '<path>';

  createApp({
    'my-card': Card,
  });
</script>

...

<my-card title="Lorem Ipsum">
  <p>My content here...</p>
</my-card>
```

Control widgets using attributes (see widgets documentation)

### Interaction with parent app

We implemented two ways to interact with parent application - one is data-based, another events-based.
You will find supported data properties and handled events list in slot's documentation.
Let's see how you can use it to build your app:

### Data-based interface with `watch/commit`

If some data-based interface is documented for particular slot
you may subscribe on it using `watch` method or publish changes using `commit`

```html
<script type="module">
  import createApp from '<path>';

  const app = createApp();

  app.watch('observed', (value) => {
    /* handle "observed" property change here */
  });

  app.commit({
    observed: /* Desired "observed" value here */,
  });
</script>
```

Use `watch('observed', (value) => { ... })` to watch `observed` property

Use `watch('*', (all) => { ... })` or just `watch((all) => { ... })` to watch all provided
properties at once

Use `commit({ observed: 'ABC' })` to commit values that you want to be sent to parent app.

**N.B.: Only expected properties will be processed. Anything unexpected will be omitted**

**N.B.2: Due to security reasons this tool supports only simple values - like Strings, Numbers and Booleans (in depth too).
Functions, Dates etc. will not work.**

### Events-based interface with `listen/emit`;

```html
<script type="module">
  import createApp from '<path>';

  const app = createApp();

  app.emit('openDialog', {
    title: 'Lorem Ipsum',
    description: 'Dolor sit amet',
  });

  app.listen('dialog:confirmed', () => {
    /* handle parent app dialog confirmation */
  });
</script>
```
