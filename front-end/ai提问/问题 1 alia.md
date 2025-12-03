为什么我这个 的 @不好使，但是
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "files": []
}
```

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "react-jsx",
    "lib": ["ESNext", "DOM"],
    "useDefineForClassFields": true,
    "baseUrl": ".",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "types": ["vite/client", "node"],
    "allowImportingTsExtensions": false,
    /* Linting */
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": false,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  },
  "include": ["src", "scripts", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

这个就好使呢
