const cheerio = require('cheerio')

const ParseOptions = require('./ParseOptions')
const NestHeadings = require('./NestHeadings')
const BuildList = require('./BuildList')

const defaults = {
  tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
  wrapper: 'nav',
  wrapperClass: 'toc',
  heading: true,
  headingClass: 'toc-heading',
  headingLevel: 'h2',
  headingText: 'Table of contents',
  ul: false,
  flat: false,
}

const BuildTOC = (text, opts) => {
  const {
    tags,
    wrapper,
    wrapperClass,
    heading,
    headingClass,
    headingLevel,
    headingText,
    ul,
    flat,
  } = ParseOptions(opts, defaults)
  const $ = cheerio.load(text)
  const headings = NestHeadings(tags, $)
  const output = `<${wrapper} class="${wrapperClass}" role="navigation" aria-label="${headingText}">${BuildList(
    headings,
    ul,
    flat
  )}</${wrapper}>`
  const outputWithHeading = `<${wrapper} class="${wrapperClass}" role="navigation" aria-labelledby="navTOC"><${headingLevel} class="${headingClass}" id="navTOC">${headingText}</${headingLevel}>${BuildList(
    headings,
    ul,
    flat
  )}</${wrapper}>`

  if (wrapper !== 'nav' || heading) {
    return headings.length > 1 ? outputWithHeading : undefined
  } else {
    return headings.length > 1 ? output : undefined
  }
}

module.exports = BuildTOC
