# Contributing to Open Hotel
🌟 Thank you for your interest in contributing to Open Hotel! 🌟

The following guidelines are here to help you contribute to Open Hotel, a project dedicated to creating a free and customizable virtual hotel experience. These are suggestions, not strict rules, so use your best judgment when contributing!

---

## Table of Contents

- [Before Contributing](#before-contributing)
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Code Contributions](#code-contributions)
    - [Art Contributions](#art-contributions)
    - [Pull Requests](#pull-requests)
- [Coding Guidelines](#coding-guidelines)
- [Have Questions? Join Our Discord!](#have-questions-join-our-discord)
- [License](#license)

---

## Before Contributing

Open Hotel is an open-source project aiming to provide a free and customizable virtual self-hosted hotel experience. The project is composed of multiple repositories, which you can find on our [GitHub organization page](https://github.com/openhotel/).

The main repository is [openhotel/openhotel](https://github.com/openhotel/openhotel/), and it’s the best place to start contributing.

---

## Code of Conduct

To ensure a welcoming and inclusive environment, all contributors are expected to:

- Be respectful and considerate to others.
- Refrain from using abusive, derogatory, or discriminatory language.
- Provide constructive feedback and engage in collaborative problem-solving.

Violations of this code may result in your contributions being rejected and further actions taken to maintain community standards.

---

## How Can I Contribute?

### Reporting Bugs

If you encounter a bug:

1. Search [existing issues](https://github.com/openhotel/openhotel/issues) to see if it’s already reported.
2. If not, [create a new issue](https://github.com/openhotel/openhotel/issues/new). Include:
    - A clear and descriptive title.
    - Steps to reproduce the bug.
    - Expected vs. actual behavior.
    - Your operating system, browser version, and any logs if applicable.

### Suggesting Features

We welcome feature suggestions! To propose a feature:

1. Check [existing issues](https://github.com/openhotel/openhotel/issues) to ensure it hasn’t been suggested.
2. [Open a new issue](https://github.com/openhotel/openhotel/issues/new) and include:
    - A detailed description of the feature.
    - Why this feature would benefit users.
    - Any implementation ideas (optional).

### Code Contributions

We accept contributions of all sizes! Examples include:

- Improving existing functionality or adding new features.
- Resolving issues.
- Fixing typos or improving documentation.

### Art Contributions

Open Hotel uses a pixel art style for its assets, and it uses metadata to define some of the properties of the assets. We strongly recommend taking a look at our proprietary [Asset Editor](https://github.com/openhotel/asset-editor) repository to create compatible assets. Some examples of contributions include:

- Icons, sprites, furniture...
- UI/UX improvements.
- Backgrounds, tiles, and other visual elements.

Make sure any artistic contributions align with the overall aesthetic and respect licensing terms.

### Pull Requests

We welcome pull requests! Here’s how to ensure a smooth process:

- Use the following convention for PR titles: `type: descriptive text - fix #XXX`. Here:
    - `type` should be descriptive (e.g., `feat` for features, `fix` for bug fixes, `art` for art-focused PRs).
    - `XXX` refers to the related issue (if there is one).
    - Examples:
        - `feat: Add user profile customization - fix #12` (On merge, issue 12 will be closed automatically)
        - `fix: Bug where character doesn’t move - fix #42` (On merge, issue 42 will be closed automatically)
- Ensure your branch is up-to-date with the latest `master` branch before opening a pull request.
- Provide a clear description of your changes in the pull request body.
- Add tests if applicable.
- Run tests if available and ensure all checks pass before submitting.
- Check the coding guidelines below for code formatting and style. Your PR will be automatically checked for formatting issues.

---

## Coding Guidelines

- **Enable Prettier:** Use `npx prettier --write .` to format your code. On Windows, Prettier sometimes bugs out and says that all files have been modified. Ignore it, and add/commit/push normally.
- **Write Tests:** If you can, add tests for any new functionality. Some features may be hard to test; if so, mention it in your PR. Run tests if they are available.
- **Follow Commit Guidelines:** Use clear, descriptive commit messages.
- **Respect the Project Scope:** Ensure contributions align with Open Hotel’s mission to remain open and non-commercial.

### Development Tips

- Regularly sync with the `master` branch to avoid conflicts.
- Run existing tests (if there’s any test) before pushing changes.

---

## Have Questions? Join Our Discord!

If you have any further questions, need clarification, or just want to connect with the community, join our [Discord server](https://discord.gg/). We’re happy to help and always open to feedback and collaboration!

---

## License

By contributing, you agree that your contributions will be licensed under the same [CC BY-NC-SA 4.0](./LICENSE) license as the project. Please read the [LICENSE](./LICENSE) and [README](./README.md) carefully. Any use of this project or derivative work for commercial purposes is strictly forbidden and will be prosecuted.

Thank you for contributing to Open Hotel! Let’s build something amazing together. 🌟

