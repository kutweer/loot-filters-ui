# Loot Filters UI

Loot filers UI provides an easy way to share customizable loot filters for the [Rune Lite](https://runelite.net/) [Loot Filters](https://runelite.net/plugin-hub/show/loot-filters) plugin.

The loot-filters plugin provides a way to write and execute code to configure the way that ground items are rendered in game. However writing a filter is somewhat complicated (see [rs2f docs](https://github.com/riktenx/loot-filters/blob/userguide/README.md))
and the purpose of this site is to make sharing and customizing filters a more accessible experience.

## Writing Customizable Loot Filters using the Module System

To write a customizable filter you need to understand a bit about how `rs2f` works. Specifically [macros](https://github.com/riktenx/loot-filters/blob/userguide/filter-lang.md#macros). If you don't understand macros, read that first.

### What is a customizable filter?

A filter is really just a name, description and a list of modules. A filter definition looks like this:

```json
{
    "name": "my fancy filter",
    "description": "For my fans"
    "modules": [...]
}
```

A filter hosted somewhere can be imported in the UI by just putting in the URL and hitting import.
![./images/filter_import.png](./images/filter_import.png)

### What is a module

A module is a pairing of a JSON schema defining what inputs can be configured, and a `rs2f` file which is the filter code itself. The UI renders the inptus configured in the JSON and will replace the definition (right hand side) of the related macro when you download the filter. If there are multiple modules the site will concatenate them all into a single file.

The JSON provides a clean way to inform the UI as to what kind of input to expose to the user, ie. a simple `boolean` or a full `style` configuration with color-pickers etc.

While module content can be in-lined, the best way to include module files is to host them separately, and then reference them by URL, here's how to incldue a Vorkath module.

```json
{
    "name": "my fancy filter",
    "description": "For my fans",
    "modules": [
        {
            "name": "Vorkath",
            "moduleJsonUrl": "https://example.com/vorkath.json",
            "moduleRs2fUrl": "https://example.com/vorkath.rs2f"
        }
    ]
}
```

### Writing a module

Eventually there will be more docs here, but for now:

If you're an examples-based learner go read through either of the example filters [Filterscape](https://github.com/riktenx/filterscape/) [Typical Whack's filter for Persnickety Irons](https://github.com/typical-whack/loot-filters-modules).

If you learn by reading specs and docs then right now the best we've got is the TypeScript type definitions the UI uses Modules and Filter types are defined in [ModularFilterSpec.ts](https://github.com/Kaqemeex/loot-filters-ui/blob/main/src/types/ModularFilterSpec.ts) and the supported inputs are in [InputSpec.ts](https://github.com/Kaqemeex/loot-filters-ui/blob/main/src/types/InputsSpec.ts).

Filters are best hosted in GitHub both because they provide free hosting, and because you can version the content

#### Optional modules

For some filters you may want to include a module that's optional, maybe for a boss or some other custom styling.
All modules can be disabled in the UI, but if you want it disabled by default set `enabled: false` at the top level of your module definition.
