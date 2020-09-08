const cheerio = require('cheerio')
const ParseOptions = require('./ParseOptions')
const NestHeadings = require('./NestHeadings')
const BuildList = require('./BuildList')

const defaults = {
  tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
  wrapper: 'nav',
  wrapperClass: 'toc',
  wrapperLabel: 'Table of contents',
  wrapperHeading: false,
  wrapperHeadingLevel: 'h2',
  wrapperHeadingClass: 'toc-heading',
  listType: 'ul',
  flat: false,
}

const BuildTOC = (text, opts) => {
  const {
    tags,
    wrapper,
    wrapperClass,
    wrapperLabel,
    wrapperHeading,
    wrapperHeadingLevel,
    wrapperHeadingClass,
    listType,
    flat,
  } = ParseOptions(opts, defaults)
  const $ = cheerio.load(text)
  const headings = NestHeadings(tags, $)
  const output = `<${wrapper} class="${wrapperClass}" aria-label="${wrapperLabel}">${BuildList(
    headings,
    listType,
    flat
  )}</${wrapper}>`
  const outputWithHeading = `<${wrapper} class="${wrapperClass}" role="navigation" aria-labelledby="toc-label"><${wrapperHeadingLevel} class="${wrapperHeadingClass}" id="toc-label">${wrapperLabel}</${wrapperHeadingLevel}>${BuildList(
    headings,
    listType,
    flat
  )}</${wrapper}>`

  if (wrapper !== 'nav' || wrapperHeading) {
    return headings.length > 1 ? outputWithHeading : undefined
  } else {
    return headings.length > 1 ? output : undefined
  }
}

module.exports = BuildTOC
