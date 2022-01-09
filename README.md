# Hyper

Hyper is a small hook-based request library for React.

> Why not [swr, react-query, etc.]?

The primary difference is that useHyper makes it easier to revalidate the data and exports a React Provider allowing you to set global defaults. Additionally, it makes mutation easier than other libs (better mutation is coming very soon).

If you're happily using SWR, React Query, or any of the many request libs for React, there's probably not a large incentive to switch. As of right now, caching **is not** implemented. It may be later, in the form of localStorage, but this is yet to be determined.

## Features

Primarily, Hyper provides these useful things:

-   Set a global URL prefix for all requests. If you don't like typing "http://localhost:3000/" for _every_ request, you can set that string as a prefix. Therefore, you only need to specify the endpoint.
-   Options can be declared globally, via the Provider, or locally, within each call of `useHyper`.
-   You can revalidate the data on certain window events (like the loss or gain of focus) or manually with the `revalidate()` function.

## Basic Usage

First, import the `HyperProvider` and wrap some of your components. (The HyperProvider won't re-render, so you can place it wherever you'd like, but still be aware that [not all providers are pure](https://infinium.earth/article/take-care-with-providers) in this way.)

```jsx
import { HyperProvider } from '@infinium/hyper';

const App = () => (
    <HyperProvider config={{ ... }}>
        <TheRestOfYourApp />
    </HyperProvider>
);
```

Then you can import the `useHyper` hook in any child component of `App`!

## Documentation

This section will explain the functions, config values, and operating procedures of Hyper.

### `useHyper(url: string, config: Config = {})`

This is the primary query hook. It accepts the following arguments:

-   `url: string` The URL you want to request. This can also be an endpoint if you've set the `prefix` config value.
-   `config: Config` specify different config values for each hook instance individually.

**Usage:**

```js
import useHyper from '@infinium/hyper';

const App = () => {
	const { data, error } = useHyper('/posts');

	if (error) {
		return <p>ERROR!!!</p>;
	}

	if (!data) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			{data.map(post => (
				<p>{post.title}</p>
			))}
		</div>
	);
};
```

For a moment, take note of the order of the conditions. First, we check for an error. Then, we check for validity of `data`, and finally we return the tree.

This _must_ be the order that you check these values. If there's an error, we need to know right away. If your request initially fails and you have specified `if (error)` beneath `if (!data)`, your component will always return loading.

#### Exports

The hook exports an object with a variety of values.

##### `data: Object | undefined`

This is the response data from your request. It starts off `undefined` and then is given the response value if the request was successful. If you want to check if the request is loading, check if `data` is defined. See the example above.

##### `status: Status`

This is a string representing the current status of the request. It starts off `idle`.

The values `status` could be are:

-   `success`: When the request succeeds (status code 200)
-   `error`: When the request fails for any reason.
-   `pending`: When the request is loading.
-   `idle`: Before a request is made.

##### `req: Promise<any> | undefined`

If, for whatever reason, you'd like access to the returned `Promise` from the `axios` request, you can do so with the `req` object.

Use it like so:

```js
const { req } = useHyper('/posts');

req.then(data => console.log(data));
```

##### `error: undefined | boolean | Error`

If the request fails, this value will be populated with the error the request threw.

##### `revalidate() => Promise<any>`

If you want to manually revalidate the data (aka: send a new request), you can do so with this. Simply call the function.

### `HyperProvider`

This is a component that should wrap around your `App` (or the nearest place it is needed). It is used to set global config values that every `useHyper` instance will use. Within each instance, of course, the global values can be overridden.

Note: the provider **is** required.

**Usage:**

```jsx
import { HyperProvider } from '@infinium/hyper';

const App = () => (
    <HyperProvider config={{ ... }}>
        <TheRestOfYourApp />
    </HyperProvider>
);
```

### Config

To allow you to customize some of the behavior of Hyper, both the provider and the hook allow you to specify some config values. These are explained here:

-   `prefix`: This value will prefix all endpoints you specify within each hook instance. Standard practice is to set this value in the provider and then manually override it within individual hook instances on an as-needed basis. If you don't want one hook call to use the prefix, set it to `false`
-   `method`: This is the method of the hook request. It defaults to `get`.
-   `data`: Any request data you need to send. If you set data on the provider, this will be merged into each hook request. That is, for instance, you can declare an authorization header within `data`, and then add some more data to each request individually.
-   `revalidateOnFocus`, `revalidateOnBlur`: When the window gains or loses focus, refetch the data ("revalidate"). `revalidateOnFocus` defaults to `true`, the latter to `false`. The `data` value exported by the hook **does not** re-render when the refetched data is the same.
-   `maxRequests`: The maximum number of requests allowed to happen. Defaults to `10`. This is particularly useful when you accidentally let the hook run infinitely. This value will stop that and throw an error.
-   `retries`: If the initial request fails, `useHyper` will automatically retry it. This value specifies how many times the request will be retried. If you don't want this behavior, set `retries` to `0`. It defaults to `2`.

## Developing

If you want to modify Hyper, you're in the right place.

**Development environment**

1. Install the packages in the root directory and the `example/` directory.
2. Start the [JSON server](https://github.com/typicode/json-server) by navigating into the `example/` directory: `json-server --watch db.json --port 3002`
3. While in the `example/` directory, also start the dev server (React): `yarn start`
4. Finally, in the root directory ("Hyper"), start the file watcher: `yarn start`.

When you're done, you should have at least 3 terminal windows occupied. Now, just modify the code you need and it should bundle for you!
