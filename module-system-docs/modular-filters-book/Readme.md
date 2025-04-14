# Chatper 1: Getting started with modular filters

Modular filters are an extension of the filter framework provided by the loot-filters plugin that allow you to build, share and configure filters via the loot-filters UI.

These docs will walk you through from never having done any development, programming or configured a filter before, to having a complete filter that you can use and extend as you like.

## 1.1: GitHub

The best way to store and share your filters is on [GitHub](http://github.com) they host files for free, and they have a lot of tools that we'll be using throughout this tutorial. If you don't have an account go make one now.

## 1.2: Create a repository

You can follow [GitHub's docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories) on this. They've got nice screenshots etc. and will update their own docs if anything changes in their UI.

## 1.3: Clone the repository

If you're not familiar with `git`, it's a "Version Control System" if you want to know what that means, or generally want to know more about `git`, check out [https://git-scm.com](https://git-scm.com/book/en/v2). Its a digital book in tons of different languages that cover way more than you'll ever want to know.

If you've never used git before, you should use [GitHub Desktop](https://desktop.github.com/download/). It will make everything easier since it's made by GitHub for interacting with their website, and you can continue to rely on their docs if you get stuck on anything. You can clone directly into GitHub desktop from the browser with this option:
![clone UI image](./images/ch_1-clone.png)

## 1.4: Editors

You can edit your files with whatever tool you're comfortable with. For the purposes of this tutorial we're going to use [VS Code](https://code.visualstudio.com/).

With VS Code installed; go to `File` > `Open Folder` and open up the folder for your project.

Now you're ready for Chapter 2.

# Chapter 2: Creating a Filter

In this chapter we're going to go from 0 filter - to something you can actually import into the loot-filters UI.

## 2.1 First steps

Create a file called `filter.rs2f`. For now, the file should contain just a rs2f [meta](https://github.com/riktenx/loot-filters/blob/userguide/filter-lang.md#the-meta-block) which sets the name and description of our filter.

```cpp
meta {
    name = "My Filter"
    description = "My first filter"
}
```

That's it - you now, in the most technical sense, do have a 'filter'. It has no modules inputs or filtering so it won't do anything. But it does exist. Lets save it, and push it up to GitHub.

## 2.2 GitHub, branches

In industry, software development shops we push our changes to a `branch`, which then is compared with the `main` branch. Our co-workers then review the changes, leave comments and eventually our changes are `merged` with the main branch.

Since this filter is just an example, and only 1 person is working on it we're going to dispense with all of that. We'll just operate off the 1 branch we have `main`.

GitHub desktop will show you the changes you've made, deleted lines will be red, new lines will be green. In this case we deleted no lines and created 5, so we'll have an all-green file with the json text above in it. GitHub has [documentation](https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop) for committing and pushing your changes.

If prompted to commit or push your changes to another branch; skip that we don't need to in this case. Once you've committed in the top right there should be an option to `push` your changes from your computer into the cloud. Once you've done that you can visit your repository and see your new file there.

## 2.3 Loading your filter for the first time

Now that we have our file in the cloud we can load our filter in the UI. Browse to GitHub and open your file
![open file](./images/ch_2-open_file.png)

Then with your file open; navigate to the 'raw' view of your file:
![open raw](./images/ch_2-open_raw.png)

Copy the URL for this page and go to the [Loot Filters UI](https://loot-filters.kaqemeex.net/). Click the button to import a filter.
Choose the import from URL option and, paste your URL into the URL input:
![import](./images/ch_2-import_filter.png)

Now hit Import and your filter should load. As we said before, there are no modules so you can't do much in the UI at this point.
But if all the steps have been followed correctly the filter should load, and be available in the `select a filter` dropdown.

# Chapter 3: Adding functionality

In this chapter we're going to do add filter functionality, and connect it to the UI to make it configurable.

## 3.1 A list of items to hide

Below the meta block lets add another section of rs2f.

```cpp
#define VAR_ITEMS_TO_HIDE []

if (name:VAR_ITEMS_TO_HIDE) {
    hidden = true;
}
```

This rs2f will cause any item in the `VAR_ITEMS_TO_HIDE` list to be hidden, however the list is currently empty and not configurable by the UI. Lets change that. First we need to define a module. A module is a collection of inputs, the top level collapseable section you see in the UI.

Modules and inputs are defined using a structured comment syntax. Structured comments work like this:

1. The first line must be `/*@ define:[module|input]:[identifier]` this defines what kind of content to expect in the rest of the comment.
2. The body of the comment must be a valid YAML object with the appropriate fields for either an input or a module.
3. Then the comment is closed with a `*/`

For our first module the comment will look something like, you can put this anywhere between the `meta{}` block and the `#define`.

```cpp
/*@ define:module:my_first_module
name: My First Module
subtitle: A short phrase
description: |
    A long description; shown when the module is expanded.

    Can use line breaks and markdown for formatting, including [links](http://google.com),
    - lists

    # and various heading sizes
*/
```

In this example we've created a module with the ID `my_first_module`, it's name is `My First Module` and it has a long description.

Next we need to define an input for our list like so:

```cpp
/*@ define:input:my_first_module
type: stringlist
label: Items to Hide
*/
```

This creates a `stringlist` input in the module `my_first_module`. This comment **must** be placed directly above the `#define` for our list. This is because the default value for our input will be pulled from that `#define VAR_ITEMS_TO_HIDE` declaration.

Finally - lets update the value of that define to hide `ashes` default `#define VAR_ITEMS_TO_HIDE ["ashes"]`

<details>
<summary>
You can check your work by comparing what you have to this example.
</summary>

```cpp
meta {
    name = "My Filter"
    description = "My first filter"
}
/*@ define:module:my_first_module
name: My First Module
subtitle: A short phrase
description: |
    A long description; shown when the module is expanded.

    Can use line breaks and markdown for formatting, including [links](http://google.com),
    - lists

    # and various heading sizes
*/

/*@ define:input:my_first_module
type: stringlist
label: Items To Hide
*/
#define VAR_ITEMS_TO_HIDE ["ashes"]

if (name:VAR_ITEMS_TO_HIDE) {
    hidden = true;
}
```

</details>

## 3.2 Updating in the site

You can commit and push this up to GitHub. Once the cache expires (can be a few minutes) when you refresh the filterscape site the `update` button will be enabled and you can press it to update your filter.

You should now have a module, with a list input for hiding your items!

# Chapter 4: Other inputs

This section isn't linear, it covers the structured comments for all the supported input types

## 4.1: Boolean

Boolean inputs are the simplest input type. They create a checkbox in the UI that toggles between true and false. They are configured like this:

```cpp
/*@ define:input:module_id
type: boolean
label: A label
*/
#define VAR_MY_BOOL true
```

## 4.2: Number

Number inputs create a text box that only accepts whole integers. Here's how to configure a number input:

```cpp
/*@ define:input:module_id
type: number
label: A label
*/
#define VAR_MY_NUMBER 100
```

## 4.3: Lists

There are different kinds of list inputs for different situations. Currently 2 are supported

### 4.3.1: EnumList

Provides a dropdown in the UI with a restricted set of options. The `enum` property defines the possible values,
the `value` property is what will be rendered into the filter, the `label` property is a more nicely formated one for the UI to display in the dropdown.

```cpp
/*@ define:input:module_id
type: enumlist
label: A label
enum:
    - value: ugly item name
      label: Nice Item Name
    - value: second item
      label: Second Item
*/
#define VAR_MY_ENUM_LIST ["ugly item name"]
```

### 4.3.2: StringList

Provides a dropdown in the UI where you can put in any number of strings.

```cpp
/*@ define:input:module_id
type: stringlist
label: A label
*/
#define VAR_MY_STRING_LIST ["an item"]
```

## 4.4: Style

An input that allows configuring all the available style options. All colors are in the `#AARRGGBB` alpha rgb format. For a more complete list of values see the [loot filter plugin docs](https://github.com/riktenx/loot-filters/blob/userguide/filter-lang.md#display-settings).

```cpp
/*@ define:input:module_id
type: style
label: A label
*/
#define VAR_MY_STYLE textColor="#FFFFFFFF"
```
