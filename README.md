<div align="center">

# 🔗 LinkSutra

### *ek sutra. saare links. fully yours.*

**An open-source, privacy-first, self-hostable link-in-bio platform**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/arpitsharma7777/linksutra?style=social)](https://github.com/arpitsharma7777/linksutra)
[![GitHub issues](https://img.shields.io/github/issues/arpitsharma7777/linksutra)](https://github.com/arpitsharma7777/linksutra/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Contributing](#contributing) • [License](#license)

</div>

---

## 🤔 What is LinkSutra?



LinkSutra is a free, open-source alternative to Linktree that gives creators, developers, and privacy-conscious users **true ownership** of their online presence.

Most link-in-bio platforms:
- ❌ Force their branding on your page
- ❌ Surveil your visitors with third-party trackers
- ❌ Can ban your account and delete all your data overnight
- ❌ Lock you into their infrastructure forever

LinkSutra fixes all of that.

---

## ✨ Features

### Core Features
- 🔗 **Unlimited Links** — add, edit, reorder, and manage links freely
- 🎨 **3 Beautiful Themes** — minimal, dark, and colorful
- 📊 **Privacy-First Analytics** — server-side click tracking, zero cookies
- 👤 **Custom Profile** — bio, avatar, display name
- 📦 **Full Data Export** — download your entire profile as JSON anytime


### Developer Features
- ⚡ **REST API** — manage links programmatically
- 🐳 **Self-Hostable** — run on your own server 
- 🔓 **No Vendor Lock-in** — your data, your server, your rules



---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | SQLAlchemy |
| Frontend | React + Vite 
| Public Profile | HTML + CSS + Vanilla JS |
| Auth | JWT (python-jose) |


---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Local Setup

**1. Clone the repo**
```bash
git clone https://github.com/arpitsharma7777/linksutra.git
cd linksutra
```

**2. Backend setup**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**3. Frontend setup**
```bash
cd frontend
npm install
npm run dev
```


---





## 🤝 Contributing

Contributions are welcome! LinkSutra is built in the open, for the community.

1. Fork the repo
2. Create your branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m "feat: add amazing feature"`
4. Push to your branch — `git push origin feature/amazing-feature`
5. Open a Pull Request to `dev` branch

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---



## 📄 License

LinkSutra is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

This means:
- ✅ Free to use, modify, and self-host
- ✅ Must keep source code open if you host it publicly
- ✅ Must credit original authors

See [LICENSE](LICENSE) for full details.

---

## 👨‍💻 Built With ❤️ for FOSS Hack 2026

> *"Your link page. Your data. Your rules."*

<div align="center">
MADE BY  TEAM Hackfinity ∞

</div>