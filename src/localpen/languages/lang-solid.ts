import { LanguageSpecs } from '../models';
import { parserPlugins } from './parser-plugins';
declare const importScripts: (...args: string[]) => void;

export const solid: LanguageSpecs = {
  name: 'solid',
  title: 'Solid',
  info: `
  <h3>Solid</h3>
  <div>A declarative, efficient and flexible JavaScript library for building user interfaces.</div>
  <ul>
    <li><a href="https://www.solidjs.com/" target="_blank" rel="noopener">Official website</a></li>
    <li><a href="https://www.solidjs.com/docs" target="_blank" rel="noopener">Documentation</a></li>
    <!-- <li><a href="#">Solid usage in LocalPen</a></li> -->
  </ul>
  `,
  parser: {
    name: 'babel',
    pluginUrls: [parserPlugins.babel, parserPlugins.html],
  },
  compiler: {
    url: 'vendor/babel-preset-solid/babel-preset-solid.js',
    factory: () => {
      importScripts('vendor/babel/babel.min.js');
      const Babel = (self as any).Babel;
      Babel.registerPreset('solid', (self as any).babelPresetSolid.solid);
      return Babel.transform;
    },
    umd: true,
  },
  extensions: ['solid.jsx'],
  editor: 'script',
};