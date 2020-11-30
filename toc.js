// Extending https://github.com/JordanShurmer/eleventy-plugin-toc
const cheerio = require( 'cheerio' ),
  /** Attribute which if found on a heading means the heading is excluded */
  ignoreAttribute = 'data-toc-exclude',
  defaults = {
    tags: [ 'h2', 'h3', 'h4', 'h5', 'h6' ],
    wrapper: 'nav',
    wrapperClass: 'nav-toc',
    heading: true,
    headingClass: 'nav-toc-heading',
    headingLevel: 'h2',
    headingText: 'Table of contents',
    listType: 'ol',
    listClass: 'nav-toc-list',
    listItemClass: 'nav-toc-list-item',
    listItemAnchorClass: 'nav-toc-list-item-anchor',
  };

// Verify "tags" option values are correct
function checkTags( value, key ) {
  const regex = /(h1|h2|h3|h4|h5|h6)/g,
    optionToCheck = value;

  if ( optionToCheck.length > 0 && typeof optionToCheck === 'object' ) {
    for ( let i = 0; i < optionToCheck.length; i++ ) {
      if ( !optionToCheck[ i ].match( regex )) {
        console.error(
          '\n⛔ Error (ToC): There’s a “' +
            optionToCheck[ i ] +
            '” in the “' +
            key +
            '” option. Please use heading levels h2 – h6 instead.\n'
        );

        return false;
      }
    }
  } else if ( optionToCheck.length > 0 && !optionToCheck.match( regex )) {
    console.error(
      '\n⛔ Error (ToC): There’s a “' +
        optionToCheck +
        '” in the “' +
        key +
        '” option. Please use heading levels h2 – h6 instead.\n'
    );

    return false;
  }
}

// Verify "heading" option value is correct
function checkHeading( value ) {
  const optionToCheck = value;

  if ( optionToCheck.length > 0 && typeof optionToCheck !== 'boolean' ) {
    console.error( '\n⛔ Error (ToC): The “heading” option needs a Boolean value.\n' );

    return false;
  }
}

// Verify "listType" option value is correct
function checkListType( value ) {
  const regex = /(ol|ul)/g,
    optionToCheck = value;

  if ( optionToCheck.length > 0 && !optionToCheck.match( regex )) {
    console.error(
      '\n⛔ Error (ToC): There’s a “' + optionToCheck + '” in the “listType” option. Please use “ol” or “ul” instead.\n'
    );

    return false;
  }
}

// Verify the option exists
function checkLength( value, key ) {
  const optionToCheck = value;

  if ( optionToCheck.length <= 0 ) {
    console.error( '\n⛔ Error (ToC): The “' + key + '” option must have a value.\n' );

    return false;
  }
}

// Run the checks
checkTags( defaults.tags, 'tags' );
checkHeading( defaults.heading );
checkTags( defaults.headingLevel, 'headingLevel' );
checkListType( defaults.listType );
checkLength( defaults.tags, 'tags' );
checkLength( defaults.wrapper, 'wrapper' );
checkLength( defaults.heading, 'heading' );
checkLength( defaults.headingLevel, 'headingLevel' );
checkLength( defaults.headingText, 'headingText' );
checkLength( defaults.listType, 'listType' );

function getParent( prev, current ) {
  if ( current.level > prev.level ) {
    //child heading
    return prev;
  } else if ( current.level === prev.level ) {
    //sibling of previous
    return prev.parent;
  } else {
    //above the previous
    return getParent( prev.parent, current );
  }
}

class Item {
  constructor( $el, options = defaults ) {
    this.options = { ...defaults, ...options };

    if ( $el ) {
      this.slug = $el.attr( 'id' );
      this.text = $el.text();
      this.level = +$el.get( 0 ).tagName.slice( 1 );
    } else {
      this.level = 0;
    }

    this.children = [];
  }

  html() {
    const { listType, listClass, listItemClass, listItemAnchorClass } = this.options,
      markupListItemStart = '<li>',
      markupListItemStartClass = `<li class="${listItemClass}">`,
      markupListItemAnchor = `<a href="#${this.slug}">${this.text}</a>`,
      markupListItemAnchorClass = `<a class="${listItemAnchorClass}" href="#${this.slug}">${this.text}</a>`;

    let markup = '';

    // Does the list item have a URL and text
    if ( this.slug && this.text ) {
      // Does the list item have a class
      if ( listItemClass.length > 0 ) {
        // Does the anchor have a class
        if ( listItemAnchorClass.length > 0 ) {
          markup += markupListItemStartClass + markupListItemAnchorClass;
        } else {
          markup += markupListItemStartClass + markupListItemAnchor;
        }
      } else {
        // Does the anchor have a class
        if ( listItemAnchorClass.length > 0 ) {
          markup += markupListItemStart + markupListItemAnchorClass;
        } else {
          markup += markupListItemStart + markupListItemAnchor;
        }
      }
    }

    if ( this.children.length > 0 ) {
      // Does the list have a class
      if ( listClass.length > 0 ) {
        markup += `<${listType} class="${listClass}">${this.children
          .map(( item ) => item.html())
          .join( '\n' )}</${listType}>`;
      } else {
        markup += `<${listType}>${this.children.map(( item ) => item.html()).join( '\n' )}</${listType}>`;
      }
    }

    if ( this.slug && this.text ) {
      markup += '\t\t</li>';
    }

    return markup;
  }
}

class Toc {
  constructor( htmlstring = '', options = defaults ) {
    this.options = { ...defaults, ...options };
    this.root = new Item( '', this.options );
    this.root.parent = this.root;

    const selector = this.options.tags.join( ',' ),
      $ = cheerio.load( htmlstring ),
      headings = $( selector ).filter( '[id]' ).filter( `:not([${ignoreAttribute}])` );

    if ( headings.length ) {
      let previous = this.root;

      headings.each(( index, heading ) => {
        const current = new Item( $( heading ), this.options ),
          parent = getParent( previous, current );

        current.parent = parent;
        parent.children.push( current );
        previous = current;
      });
    }
  }

  get() {
    return this.root;
  }

  html() {
    const { wrapper, wrapperClass, heading, headingClass, headingLevel, headingText } = this.options,
      root = this.get(),
      markupWrapperStart = `<${wrapper} role="navigation" aria-label="${headingText}">`,
      markupWrapperStartClass = `<${wrapper} class="${wrapperClass}" role="navigation" aria-label="${headingText}">`,
      markupWrapperHeadingStart = `<${wrapper} role="navigation" aria-labelledby="${wrapperClass}">`,
      markupWrapperHeadingStartClass = `<${wrapper} class="${wrapperClass}" role="navigation" aria-labelledby="${wrapperClass}">`,
      markupHeading = `<${headingLevel} id="${wrapperClass}">${headingText}</${headingLevel}>`,
      markupHeadingClass = `<${headingLevel} class="${headingClass}" id="${wrapperClass}">${headingText}</${headingLevel}>`,
      markupWrapperEnd = `${root.html()}</${wrapper}>`;

    let html = '';

    if ( root.children.length > 0 ) {
      // Does the nav have a class
      if ( wrapperClass.length > 0 ) {
        html = markupWrapperStartClass;

        // Does the nav have a heading
        if ( heading ) {
          if ( headingLevel ) {
            html = markupWrapperHeadingStart + markupHeading;

            // Does the heading have a class
            if ( headingClass.length > 0 ) {
              html = markupWrapperHeadingStartClass + markupHeadingClass;
            }
          } else {
            console.error( 'Please add a heading level.' );
          }
        }
      } else {
        html = markupWrapperStart;

        // Does the nav have a heading
        if ( heading ) {
          if ( headingLevel ) {
            html += markupHeading;

            // Does the heading have a class
            if ( headingClass.length > 0 ) {
              html = markupWrapperStartClass + markupHeadingClass;
            }
          } else {
            console.error( 'Please add a heading level.' );
          }
        }
      }

      html += markupWrapperEnd;
    }

    return html;
  }
}

module.exports = Toc;
module.exports.Item = Item;
