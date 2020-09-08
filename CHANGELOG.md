# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2020-09-11

### Added

- Add `aria-label` attribute to the wrapper to properly label the navigation.
- Add `wrapperLabel` option to provide appropriate label text for the navigation.
- Add `wrapperHeading` option to provide a text heading for the table of contents.
- Add `wrapperHeadingLevel` option to set the appropriate heading level.
- Add `wrapperHeadingClass` option to style the heading.

### Changed

- Upgrade and set dependency versions.

### Fixed

- Fix `ul` option not being respected on nested lists.
- Fix ESLint and Prettier issues with line endings on Windows.