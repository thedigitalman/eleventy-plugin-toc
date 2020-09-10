# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2020-09-10

### Added

- Add `role="navigation"` to the wrapper to define the landmark.
- Add `aria-label` attribute with `headingText` as the value when the wrapper is a `<nav>` element with no heading.
- Add `heading` option to provide a heading (`<h2>`) for the table of contents. Whose `id` attribute value matches the wrapper’s `aria-labelledby` (`headingText` value).
- Add `headingClass` option to style the heading.
- Add `headingLevel` option to set the appropriate heading level for your content.
- Add `headingText` option to provide text for the heading/label.

### Changed

- Upgrade and set dependency versions.
- Change the `ul` option to be a Boolean value.

### Fixed

- Fix `ul` option not being respected on nested lists.
- Fix ESLint and Prettier issues with line endings on Windows.