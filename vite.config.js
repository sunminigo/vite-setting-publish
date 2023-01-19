import {defineConfig} from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from "path";
import glob from 'glob';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy'

const isHash = false
const hash = isHash ? '.[hash]' : ''

export default defineConfig({
  root: './src',
  base: '',
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    modulePreload: {
      polyfill: false
    },
    minify: false,
    // minify: 'terser',
    // terserOptions: {
    //   parse: {
    //     // parse options
    //   },
    //   compress: {
    //     defaults: false,
    //     drop_console: false,
    //     dead_code: true,
    //     global_defs: {
    //       DEBUG: false,
    //       '@alert': 'console.log'
    //     }
    //   },
    //   mangle: false,
    //   format: {
    //     comments: false,
    //     beautify: true,
    //     quote_style: 1,
    //     indent_level: 2
    //   },
    //   sourceMap: {},
    //   ecma: 5,
    //   keep_classnames: false,
    //   keep_fnames: false,
    //   ie8: false,
    //   module: false,
    //   nameCache: null, // or specify a name cache object
    //   safari10: false,
    //   toplevel: false
    // },
    sourcemap: false,
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      input: Object.fromEntries(glob.sync('./src/**/*.html').reduce((acc, file) => {
        if (!file.includes('components')) {
          acc.push([
            path.relative('src', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ])
        }
        return acc
      }, [])),
      output: {
        assetFileNames: (assetInfo) => {
          // if (/\.(jpe?g|png|gif|svg|mov|mp4)$/.test(assetInfo.name ?? '')) {
          //   return `assets/images/[name]${hash}[extname]`;
          // }
          if (/\.(scss|css)$/.test(assetInfo.name ?? '')) {
            return `assets/css/[name]${hash}[extname]`;
          }
          return `assets/[name]${hash}[extname]`;
        },
        chunkFileNames: `[name]${hash}.js`,
        entryFileNames: `[name]${hash}.js`,
        preserveModules: `[name]${hash}.js`
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: [
        path.resolve(__dirname, 'src/components'),
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'src/assets/images'),
          dest: './assets'
        }
      ]
    })
  ]
});
