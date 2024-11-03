## 👨‍💻 Directory Structure

```
$ tree -I 'node_modules|cache|test_*|build|.cache|public|resources'
.
├── lerna.json
├── package.json
├── packages
│   ├── extension
│   │   ├── README.md
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── public
│   │   │   ├── icon-48.png
│   │   │   ├── manifest.json
│   │   │   └── vite.svg
│   │   ├── src
│   │   │   ├── App.css
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── scripts
│   │   │   │   ├── content_script.ts
│   │   │   │   └── service_worker.ts
│   │   │   └── vite-env.d.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   └── webapp
│       ├── README.md
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── postcss.config.js
│       ├── public
│       │   └── vite.svg
│       ├── src
│       │   ├── App.css
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── utils
│       │   │   └── interfaces.ts
│       │   └── vite-env.d.ts
│       ├── tailwind.config.js
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
└── pnpm-workspace.yaml

10 directories, 38 files
```
