# Loot Filter UI

A React-based user interface for creating and managing RuneLite loot filters for the plugin [RuneLite Loot Filters](https://runelite.net/plugin-hub/show/loot-filters).

## Writing Filters

If you want to write a customizable filter, see [these docs](./module-system-docs/Readme.md)

## Development

Running it locally first, `npm install` then `npm run start`.

When running locally the site will render a `dev mode` toggle switch. This enables a bunch of additional tabs with content related to debugging / testing inputs etc.

The primary 2 are the `Rendered Filter` tab which shows the actual filter content and the `Input Development` tab which renders a test version of each filter configuration input.

Enable dev mode in non-local environments with the query param `?dev=true`
