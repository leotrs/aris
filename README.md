# Aris: Research publications. Web-native. Human-first.

[![CI](https://github.com/leotrs/aris/actions/workflows/ci.yml/badge.svg)](https://github.com/leotrs/aris/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/leotrs/aris/branch/main/graph/badge.svg)](https://codecov.io/gh/leotrs/aris)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 23+](https://img.shields.io/badge/node.js-23+-green.svg)](https://nodejs.org/)

**Aris** is a web-native scientific publishing platform that replaces static PDFs with
interactive, accessible HTML documents. Built for researchers, academics, scientists,
and students, Aris makes it easy to write, revise, collaborate, and publish work that’s
readable on any device, bringing scientific publications to the web. See more at
[](https://aris.pub).


## Getting Started

### Prerequisites

- Frontend: Node.js `>=23`, NPM `>=10`
- Backend: Python `>=3.13`, PostgreSQL `>=14`, FastAPI `>=0.115`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/leotrs/aris.git
   cd aris
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   uv sync
   uvicorn main:app --reload
   ```

### Project Structure

```
aris/
│
├── backend/
├──── main.py        # FastAPI app
├──── aris           # package that contains routes, CRUD operations, etc
├──── scripts        # DB management scripts
├──── tests          # backend tests
│
├── frontend/
├──── index.html     # mounting point for the app
├──── src            # Vue 3 frontend source
├────── App.vue      # Vue App component
├────── router.js    # Vue Router component
├────── main.js      # script that mounts the app
├────── File.js      # object to hold a RSM file in memory
├────── FileStore.js # manage File objects
├────── login        # login view: auth via JWT
├────── home         # home view: view all files
├────── main         # main view: read and edit a file
├────── assets       # static resources
├────── common       # common components
├────── components   # legacy dir
├────── composables  # Vue composables
│
├── docs/            # Project documentation
│
├── docker/          # Dockerfiles
│
└── README.md
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Authors
Made with <3 by [leotrs](https://leotrs.com).

---

Aris, empowering researchers, one draft at a time.
