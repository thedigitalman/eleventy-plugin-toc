# eleventy-plugin-toc-a11y

- [Step 1: Installation](#step-1-installation)
- [Step 2: Configuration](#step-2-configuration)
- [Step 3: Usage](#step-3-usage)
  - [Default Options](#default-options)
  - [Override Default Options](#override-default-options)
- [References](#references)

This [Eleventy (11ty)](https://www.11ty.dev/) plugin generates a table of contents (TOC) from page headings using an [Eleventy filter](https://www.11ty.dev/docs/filters/).

It adds a navigation landmark with a heading and ARIA role to make it accessible<sup id="fnRef1">[[1]](#fn1)</sup> <sup id="fnRef2">[[2]](#fn2)</sup>. And creates a nested list of headings by level.

**Markdown**
```markdown
# Fruits

## Apples

### Empire

### Fuji

### Pink Lady

## Pears

### Bartlett

### Bosc

### Starkrimson
```

**HTML**
```html
<nav class="nav-toc" role="navigation" aria-labelledby="navToc">
  <h2 class="nav-toc-heading" id="navTOC">Table of contents</h2>
  <ol class="nav-toc-list">
    <li class="nav-toc-list-item">
      <a class="nav-toc-list-item-anchor" href="#apples">Apples</a>
      <ol class="nav-toc-list">
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#empire">Empire</a></li>
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#fuji">Fuji</a></li>
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#pink-lady">Pink Lady</a></li>
      </ol>
    </li>
    <li class="nav-toc-list-item">
      <a class="nav-toc-list-item-anchor" href="#oranges">Pears</a>
      <ol class="nav-toc-list">
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#bartlett">Bartlett</a></li>
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#bosc">Bosc</a></li>
        <li class="nav-toc-list-item"><a class="nav-toc-list-item-anchor" href="#starkrimson">Starkrimson</a></li>
      </ol>
    </li>
  </ol>
</nav>
```

## Step 1: Installation

```sh
npm install eleventy-plugin-toc-a11y --save-dev
```

## Step 2: Configuration

**All headings must have an `id` attribute.** The plugin uses the `id` attribute of the headings it finds to build the navigation.

You can do this manually, but using [`markdown-it`](https://www.npmjs.com/package/markdown-it) and [`markdown-it-anchor`](https://www.npmjs.com/package/markdown-it-anchor) make it easy.

Open your Eleventy config file (probably `.eleventy.js`), use `addPlugin`, and add some Markdown settings.

```js
const eleventyPluginTOC = require( 'eleventy-plugin-toc-a11y' );
const markdownIt = require( 'markdown-it' );
const markdownItAnchor = require( 'markdown-it-anchor' );

module.exports = function ( eleventyConfig ) {
  // Plugins
  eleventyConfig.addPlugin( eleventyPluginTOC );

  // Markdown settings
  eleventyConfig.setLibrary( 'md',
    markdownIt().use( markdownItAnchor )
  );
}
```

## Step 3: Usage

**All headings must be in proper order without skipping levels** <sup id="fnRef3">[[3]](#fn3)</sup>.

Open a layout template file, add the filter in an `<aside>` element, and place it before your content. This gives you a good outline, and lets people review the TOC before reading the content.

**Liquid**
```liquid
{{ content | toc }}

<main>
  {{ content }}
</main>
```

**Nunjucks**

Always include the safe filter when using Nunjucks.

```njk
{{ content | toc | safe }}

<main>
  {{ content | safe }}
</main>
```

### Default Options

```js
{
  tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
  wrapper: 'nav',
  wrapperClass: 'nav-toc',
  heading: true,
  headingClass: 'nav-toc-heading',
  headingLevel: 'h2',
  headingText: 'Table of contents',
  listType: 'ol',
  listClass: 'nav-toc-list',
  listItemClass: 'nav-toc-list-item',
  listItemAnchorClass: 'nav-toc-list-item-anchor'
}
```

| Option                | Data Type | Description                                        | Notes                                                                                                           |
| --------------------- | --------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tags`                | Object     | An array of heading levels to include in the TOC.  | Page titles (i.e. `h1`) should be excluded.                                                                     |
| `wrapper`             | String    | The navigation landmark element of the TOC.        | In most cases use `nav`. If you replace it, be sure it’s valid HTML and accessible.                             |
| `wrapperClass`        | String    | The CSS class name for the TOC parent element.     | Using an empty string removes the `class` attribute.                                                            |
| `heading`             | Boolean   | Whether the TOC uses a heading element.            | Using heading text for sections helps everyone.                                                                 |
| `headingClass`        | String    | The CSS class name for the TOC heading element.    | Using an empty string removes the `class` attribute.                                                            |
| `headingLevel`        | String    | The level of the TOC heading element.              | In most cases use `h2`, but you can use `h2` – `h6`. If you replace it, be sure it’s valid HTML and accessible. |
| `headingText`         | String    | The TOC heading element text.                      | Keep it concise and relevant.                                                                                   |
| `listType`            | String    | The type of list for navigation items.             | Use `ol` or `ul`. Other elements won’t work.                                                                    |
| `listClass`           | String    | The CSS class name for the list.                   | Using an empty string removes the `class` attribute.                                                            |
| `listItemClass`       | String    | The CSS class name for each list item.             | Using an empty string removes the `class` attribute.                                                            |
| `listItemAnchorClass` | String    | The CSS class name for each anchor in a list item. | Using an empty string removes the `class` attribute.                                                            |

### Override Default Options

You can override the default options in the Eleventy config file or inline.

**Eleventy config file**
```js
eleventyConfig.addPlugin( pluginToC, {
  wrapperClass: 'page-toc',
  wrapperHeadingClass: 'page-toc-heading',
  headingText: 'Topics',
  listType: 'ul'
});
```

**Inline (Liquid)**
```liquid
{{ content | toc(wrapperClass='page-toc',wrapperHeadingClass='page-toc-heading',headingText='Topics',listType='ul') }}
```

**Inline (Nunjucks)**
```liquid
{{ content | toc(wrapperClass='page-toc',wrapperHeadingClass='page-toc-heading',headingText='Topics',listType='ul') | safe }}
```

## References

1. <span id="fn1"></span>[4.3.6 Navigation | WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/#aria_lh_navigation) W3C [↑](#fnRef1)
1. <span id="fn2"></span>[Navigation Landmark: ARIA Landmark Example](https://www.w3.org/TR/wai-aria-practices-1.2/examples/landmarks/navigation.html) W3C ARIA Authoring Practices Task Force [↑](#fnRef2)
1. <span id="fn3"></span>[H42: Using h1-h6 to identify headings](https://www.w3.org/WAI/WCAG21/Techniques/html/H42) Techniques for WCAG 2.1 [↑](#fnRef3)