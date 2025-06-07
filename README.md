<p align="center">
  <img width="128" alt="Carthex Logo" src="https://your-logo-url.com/logo.png" alt="Carthex App Logo" width="180" height="auto" />
</p>

<h2>
  Carthex
  <a href="https://github.com/yourusername/carthex/releases">
    <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="v1.0.0">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg">
  </a>
</h2>

An offline invoicing desktop application tailored for Tunisian small businesses, artisans, and freelancers. Create professional invoices and receipts with full support for local tax formats, custom fields, and more.

<a href="#screenshots">Screenshots</a> • <a href="#features">Features</a> • <a href="#downloads">Downloads</a> • <a href="#technologies">Technologies</a> • <a href="#why">Why?</a> • <a href="#goals">Goals</a> • <a href="#development">Development</a> • <a href="#faq">FAQ</a> • <a href="#acknowledgement">Acknowledgement</a>

### Screenshots

Here's a few screenshots of Carthex. \[More soon]

![Template Example](https://your-screenshot-url.com/template1.png)
![Form View](https://your-screenshot-url.com/form.png)

### Features

* 🇹🇳 Tunisian invoice compliance (TVA, Timbre fiscal, Franchise TVA)
* 🎚 Flexible form with customizable fields.
* 🏗 Drag & drop items to reorder.
* 🎨 Modern templates that you can customize.
* 🏷 Custom invoice statuses.
* 📊 Export invoices as PDFs.
* 📴 Fully offline, no internet required.
* 🔐 Your data stays on your device.
* 💯 Totally free.

### Downloads

| Windows                                                                                                                | Linux                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| <a href='https://github.com/yourusername/carthex/releases/download/v1.0.0/Carthex.Setup.1.0.0.exe'>Download v1.0.0</a> | <a href='https://github.com/yourusername/carthex/releases/download/v1.0.0/Carthex-1.0.0-x86_64.AppImage'>Download v1.0.0</a> |

[More Download Options](https://github.com/yourusername/carthex/releases)

### Supported Platforms

**Windows**: Windows 7 and above<br>
**Linux**: Ubuntu 14+, Debian 9+, Fedora 25+

If you experience rendering issues on Linux, disable hardware acceleration:

```sh
carthex --disable-hardware-acceleration
```

### Technologies

* [Electron](https://github.com/electron/electron)
* [React](https://github.com/facebook/react)
* [Redux](https://github.com/reactjs/redux)
* [Styled-components](https://styled-components.com/)
* [Webpack](https://github.com/webpack/webpack)

### Why Carthex?

Most invoicing tools are either too complex, require a subscription, or don’t support Tunisian regulations. Carthex is simple, offline, fast, and made specifically for local use:

**Simplicity**

* No cloud, no registration.
* No internet needed to create and print invoices.

**Local Compliance**

* Supports Tunisian legal invoice elements like Timbre Fiscal and TVA exemption.

**Privacy**

* Your financial data never leaves your machine.

### Goals

* 🚀 Run fast even on older PCs
* 🧾 Support Tunisian businesses fully
* 🖼 Offer professional, clean templates
* 🔒 Keep user data 100% local
* 🎁 Be completely free and open source

### Development

To run Carthex locally:

```bash
git clone https://github.com/yourusername/carthex.git
cd carthex
yarn install
yarn dev  # Start webpack dev server
yarn start # Run the app
```

On Linux:

```bash
sudo apt install -y icnsutils graphicsmagick
```

### FAQ

**Is this built with Electron?**
Yes.

**Is it Tunisian-market focused?**
Yes, 100%.

**Does it work offline?**
Absolutely. No data ever leaves your computer.

**Do I need an account?**
No login or sign-up required.

**Will there be more features?**
Yes! More document types and templates coming soon.

### Acknowledgement

Special thanks to the open-source community and all contributors who help make simple software for real-world needs.
