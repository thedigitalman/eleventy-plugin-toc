# eleventy-plugin-toc-a11y

- [Step 1: Installation](#step-1-installation)
- [Step 2: Configuration](#step-2-configuration)
- [Step 3: Usage](#step-3-usage)
  - [Conditional Rendering](#conditional-rendering)
  - [Override Default Options](#override-default-options)

This [Eleventy (11ty)](https://www.11ty.dev/) plugin generates table of contents (TOC) navigation from page headings using an [Eleventy filter](https://www.11ty.dev/docs/filters/).

It also adds a heading/label for the TOC to help make the navigation accessible. Please reference [4.3.6 Navigation | WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_lh_navigation) and [Navigation Landmark: ARIA Landmark Example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/landmarks/navigation.html) for more information.

## Step 1: Installation

```sh
npm install eleventy-plugin-toc-a11y --save-dev
```

## Step 2: Configuration

Open your Eleventy config file (probably `.eleventy.js`), use `addPlugin`, and add some Markdown settings.

**All headings must have an `id` attribute.** The plugin uses the `id` attribute of the headings it finds to build the navigation.

You can do this manually, but using [`markdown-it`](https://www.npmjs.com/package/markdown-it) and [`markdown-it-anchor`](https://www.npmjs.com/package/markdown-it-anchor) make it easy.

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

**All headings must be in proper order without skipping levels.** Please reference [H42: Using h1-h6 to identify headings](https://www.w3.org/WAI/WCAG21/Techniques/html/H42) for more information.

Open a layout template file and add the filter to your content.

Liquid
```liquid
<aside>
  {{ content | toc }}
</aside>

<div>
  {{ content }}
</div>
```

Nunjucks
```njk
<aside>
  {{ content | toc | safe }}
</aside>

<div>
  {{ content | safe }}
</div>
```

Always include the safe filter when using Nunjucks.

### Conditional Rendering

You may want to conditionally render the wrapper element. Because the filter will return `undefined` when no markup is generated.

Liquid
```liquid
{% if content | toc %}
<aside>
  {{ content | toc }}
</aside>
{% endif %}
```

Nunjucks
```njk
{% if content | toc %}
<aside>
  {{ content | toc | safe }}
</aside>
{% endif %}
```

### Override Default Options

Default Options
```js
{
  // heading levels to include
  tags: ['h2', 'h3', 'h4', 'h5', 'h6'],

  // container element
  wrapper: 'nav',

  // class on the container element
  wrapperClass: 'toc',

  // use a heading for the TOC
  heading: true,

  // CSS class name of the TOC heading
  headingClass: 'toc-heading',

  // level of the TOC heading
  headingLevel: 'h2',

  // text of the TOC heading
  headingText: 'Table of contents',

  // use unordered lists instead of ordered lists
  ul: false,

  // use flat list structure
  flat: false,
}
```

You can override the default options in the Eleventy config file or inline.

Eleventy config file
```js
eleventyConfig.addPlugin( pluginToC, {
	wrapper: 'div',
	wrapperClass: 'page-toc',
	wrapperHeadingClass: 'page-toc-heading'
});
```

Inline options must be a stringified JSON object (`JSON.parse()`-able). You only need the key-value pairs you want to override. All [default-options](#default-options) are preserved.

Inline (Liquid)
```liquid
<aside>
  {{ content | toc: '{"tags":["h2","h3"],"wrapper":"div","wrapperClass":"page-toc"}' }}
</aside>
```

Inline (Nunjucks)
```liquid
<aside>
  {{ content | toc: '{"tags":["h2","h3"],"wrapper":"div","wrapperClass":"page-toc"}' | safe }}
</aside>
```