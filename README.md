# AuthZ Pro

> **Simple. Secure. Everywhere.** — A browser extension that generates two-factor authentication (2FA) codes directly in your desktop browser. No phone required.

[![Chrome](https://img.shields.io/badge/Chrome-4285F4?logo=googlechrome&logoColor=white)](#)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?logo=firefoxbrowser&logoColor=white)](#)
[![Edge](https://img.shields.io/badge/Edge-0078D7?logo=microsoftedge&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Building from Source](#building-from-source)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [OAuth Credentials](#oauth-credentials)
- [Themes](#themes)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core
- **TOTP & HOTP support** — Generate time-based (RFC 6238) and counter-based (RFC 4226) one-time passwords
- **Steam & Battle.net** — Full support for Steam TOTP and Battle.net format
- **QR code scanning** — Scan setup QR codes directly in your browser using your camera
- **Manual entry** — Add accounts by pasting secret keys or `otpauth://` URIs
- **Import from Google Authenticator** — Migrate via QR code migration or backup file

### Security
- **Encrypted vault** — Optional password protection with Argon2id hashing
- **Local-first** — All codes are generated locally in your browser. Your secrets never leave your device
- **Auto-lock** — Automatically locks your vault after a configurable period of inactivity
- **No telemetry** — Zero tracking, analytics, or data collection

### Sync & Backup
- **Google Drive sync** — Encrypted cloud backups via Google Drive
- **Dropbox sync** — Encrypted cloud backups via Dropbox
- **OneDrive sync** — Encrypted cloud backups via Microsoft OneDrive
- **Export/Import** — Portable encrypted backup files

### User Experience
- **12 monthly themes** — Choose from January through December accent color themes
- **Dark mode** — Automatic system preference detection with manual override
- **Compact & Flat modes** — Alternative display layouts
- **Quick search** — Instant filtering across all your accounts
- **Drag-and-drop** — Reorder accounts with drag-and-drop
- **Context menu** — Right-click to copy codes
- **Keyboard shortcuts** — Configurable hotkeys for common actions

---

## Installation

### Chrome / Brave / Opera
1. Download from [Chrome Web Store](#) (coming soon)
2. Click **Add to Chrome**
3. Pin the extension for easy access

### Firefox
1. Download from [Firefox Add-ons](#) (coming soon)
2. Click **Add to Firefox**
3. Pin the extension

### Edge
1. Download from [Edge Add-ons](#) (coming soon)
2. Click **Get**
3. Pin the extension

### Manual (Developer Mode)
1. Clone this repo and [build](#building-from-source) for your browser
2. Open your browser's extension page:
   - Chrome: `chrome://extensions` → **Load unpacked**
   - Edge: `edge://extensions` → **Load unpacked**
   - Firefox: `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on**
3. Select the built directory (`chrome/`, `firefox/`, or `edge/`)

---

## Building from Source

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **Git** (for cloning)

### Steps

```bash
# Clone the repository
git clone https://github.com/authz-pro/authz-pro.git
cd authz-pro

# Install dependencies
npm install

# Build for a specific browser
npm run chrome      # builds to ./chrome/
npm run firefox     # builds to ./firefox/
npm run edge        # builds to ./edge/

# Build all three at once
npm run prod        # builds to ./release/
```

### Output
| Command | Output Directory | Browser |
|---------|----------------|---------|
| `npm run chrome` | `chrome/` | Chrome, Brave, Opera |
| `npm run firefox` | `firefox/` | Firefox |
| `npm run edge` | `edge/` | Microsoft Edge |
| `npm run prod` | `release/` | All three |

### Build Script Details

The build process:
1. Removes previous build artifacts
2. Compiles TypeScript via Webpack with `ts-loader`
3. Type-checks in parallel via `fork-ts-checker-webpack-plugin`
4. Compiles SCSS to CSS via Dart Sass
5. Copies assets (fonts, images, icons, locale files, manifest)
6. Validates OAuth credentials are present

---

## Development Setup

### Quick Start

```bash
npm install
npm run chrome
```

Load the resulting `chrome/` directory as an unpacked extension.

### Development Build (Chrome only)

```bash
npm run dev:chrome
```

This uses Webpack's watch mode for continuous rebuilding. Output goes to `test/chrome/`.

### Running Tests

```bash
npm run test
```

Tests use Mocha + Chai + Sinon with Puppeteer for browser automation.

### Code Style

- TypeScript with strict mode
- Vue 2 SFC components
- Prettier for formatting (run via `npx prettier --write .`)
- ESLint for linting (run via `npx eslint . --ext .js,.ts`)

---

## Project Structure

```
authz-pro/
├── src/                    # TypeScript source
│   ├── background.ts       # Service worker / background script
│   ├── popup.ts            # Popup entry point
│   ├── content.ts          # Content script
│   ├── import.ts           # Import page
│   ├── options.ts          # Options page
│   ├── permissions.ts      # Permissions manager
│   ├── argon.ts            # Argon2 sandbox
│   ├── qrdebug.ts          # QR debug utility
│   ├── browser.ts          # Browser detection
│   ├── utils.ts            # Shared utilities
│   ├── syncTime.ts         # Time synchronization
│   ├── components/         # Vue 2 components
│   │   ├── Popup/          # Popup sub-components
│   │   ├── Import/         # Import page components
│   │   └── common/         # Shared form components
│   ├── models/             # Business logic
│   │   ├── backup.ts       # Cloud backup providers
│   │   ├── credentials.ts  # OAuth credentials (gitignored)
│   │   ├── encryption.ts   # Argon2 encryption
│   │   ├── key-utilities.ts# OTP key utilities
│   │   ├── otp.ts          # OTP generation
│   │   ├── settings.ts     # User settings
│   │   └── storage.ts      # Chrome storage wrappers
│   ├── store/              # Vuex state management
│   ├── definitions/        # TypeScript type definitions
│   └── test/               # Unit tests
├── sass/                   # SCSS stylesheets
│   ├── _ui.scss            # Theme system (18 themes)
│   ├── popup.scss          # Popup styles
│   ├── import.scss         # Import page styles
│   └── permissions.scss    # Permissions page styles
├── manifests/              # Browser manifests
│   ├── manifest-chrome.json
│   ├── manifest-firefox.json
│   ├── manifest-edge.json
│   └── manifest-pwa.json
├── svg/                    # Material Design SVG icons (24 icons)
├── images/                 # Extension icons and assets
├── _locales/en/            # English locale strings
├── view/                   # HTML view files
├── webpack.config.js       # Webpack configuration
└── scripts/                # Build and release scripts
```

---

## OAuth Credentials

Cloud backup (Google Drive, Dropbox, OneDrive) requires OAuth credentials. These are **not** included in the repository for security reasons.

### Setup

1. Copy the template:
   ```bash
   cp src/models/credentials.ts.example src/models/credentials.ts
   ```

2. Fill in your credentials:

   | Service | Where to Get It |
   |---------|----------------|
   | **Google Drive** | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth client ID (Web application type) |
   | **Dropbox** | [Dropbox Developers](https://www.dropbox.com/developers/apps) → Create app → App key |
   | **OneDrive** | [Azure Portal](https://portal.azure.com) → App registrations → Client ID + Client secret |

3. `credentials.ts` is `.gitignore`d by default so your keys stay local.

### Chrome Extension OAuth (optional)

For Chrome's `chrome.identity.getAuthToken()` flow, add a **Chrome Extension** OAuth client ID in the manifest's `oauth2.client_id` field (`manifests/manifest-chrome.json`). This client ID is safe to commit as it's a public identifier.

---

## Themes

AuthZ Pro includes 18 themes: 6 standard + 12 monthly accent themes.

| Theme | Primary Color | Description |
|-------|-------------|-------------|
| `normal` | #1a73e8 | Default Material Blue |
| `dark` | #8ab4f8 | Dark mode |
| `simple` | #1a73e8 | Minimal layout |
| `compact` | #1a73e8 | Dense layout |
| `flat` | #1a73e8 | Flat design |
| `accessibility` | #1a73e8 | High contrast |
| `january` / `february` ... `december` | Varies | Monthly accent colors |

Themes are selected manually in Preferences → Theme. Each monthly theme uses a distinct accent color from Google Material Design palette.

---

## FAQ

**Q: Is AuthZ Pro free?**  
A: Yes. Completely free. No paid tiers, no subscriptions, no hidden costs.

**Q: Does it work offline?**  
A: Yes. All codes are generated locally in your browser. No internet connection required.

**Q: Which services are supported?**  
A: Any service that uses TOTP (Google, GitHub, Microsoft, Facebook, etc.), HOTP, Steam, or Battle.net.

**Q: Is my data encrypted?**  
A: Yes. You can optionally password-protect your vault using Argon2id — the most secure password hashing algorithm available.

**Q: Can I sync across browsers?**  
A: Yes. AuthZ Pro supports encrypted cloud backup via Google Drive, Dropbox, and Microsoft OneDrive.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Coding Conventions
- Follow existing code style and patterns
- Use TypeScript strict mode
- Vue 2 components use the Options API
- SCSS follows the existing theme system
- Write tests for new functionality

---

## License

AuthZ Pro is released under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2024 AuthZ Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*AuthZ Pro — Simple. Secure. Everywhere.*  
[Website](https://authz.pro) · [Documentation](https://authz.pro/docs/en/overview) · [GitHub](https://github.com/authz-pro/authz-pro)
