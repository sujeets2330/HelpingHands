// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   esbuild: {
//     loader: "jsx",
//     include: /src\/.*\.js$/, // Allow JSX in .js files
//     jsxInject: `import React from 'react'`,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx", 
    include: /src\/.*\.jsx?$/, 
    jsxInject: `import React from 'react'`, 
  },
});
