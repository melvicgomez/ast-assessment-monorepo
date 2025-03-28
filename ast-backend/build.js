// build.js
const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['index.js'], // your entry file
    bundle: true,
    platform: 'node',
    target: 'node20', // match your Node.js version
    outfile: 'dist/index.js',
    minify: true,
    sourcemap: true, // optional: helpful in debugging
    external: [
      'bcryptjs',
      'passport',
      'passport-jwt',
      'dotenv',
      'express',
      'jsonwebtoken',
    ], // prevent bundling native modules
  })
  .catch(() => process.exit(1));
