import { join } from 'path';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    [join(process.cwd(), 'fix-mask-urls.cjs')]: {},
  },
}

export default config
