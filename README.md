# Idle Realm

Idle Realm is a minimalist idle strategy game where a living world evolves over time based on player choices.

The game focuses on governance, population growth, and long-term stability across multiple historical eras.

## Platform

Idle Realm is a web application designed to run inside the **Pi Browser**.

It is built as a single-page web app using:
- One HTML file
- Vanilla JavaScript
- No frameworks
- No external dependencies

## Architecture

- Single-file frontend (`index.html`)
- No backend server
- No database
- All game state is stored locally using `localStorage`

## Authentication & Consent

If Pi authentication is present, it is fully handled by the Pi SDK.

Idle Realm does not manage authentication logic, permissions, or user consent directly.

## Deployment

The project is hosted using:
- **GitHub** for source control
- **Cloudflare Pages** for static hosting

Any update pushed to the main branch is automatically deployed.

## Legal Pages

The following static pages are included at the root of the repository:
- `privacy.html` – Privacy Policy
- `terms.html` – Terms of Service

They are accessible from the game interface via simple links at the bottom of the page.

## Development Status

Idle Realm is under active development.  
New eras, mechanics, and features may be added in future updates.
