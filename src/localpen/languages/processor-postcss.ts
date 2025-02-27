import { Pen, Processors } from '../models';

export type PluginName = keyof Pen['processors']['postcss'];
type Plugin = () => any;
interface PluginSpecs {
  name: PluginName;
  title: string;
  url: string;
  factory: () => Plugin;
}

export const pluginSpecs: PluginSpecs[] = [
  {
    name: 'autoprefixer',
    title: 'Autoprefixer',
    url: 'vendor/autoprefixer/autoprefixer.js',
    factory() {
      return (self as any).autoprefixer.autoprefixer({
        overrideBrowserslist: ['last 4 version'],
      });
    },
  },
  {
    name: 'postcssPresetEnv',
    title: 'Preset Env',
    url: 'vendor/postcss-preset-env/postcss-preset-env.js',
    factory(): Plugin {
      return (self as any).postcssPresetEnv.postcssPresetEnv({
        autoprefixer: false,
        browsers: 'last 4 versions',
      });
    },
  },
];

const getSpecs = (pluginName: PluginName) => pluginSpecs.find((specs) => specs.name === pluginName);

export const postcss: Processors = {
  name: 'postcss',
  title: 'PostCSS:',
  info: `
  <h3>PostCSS</h3>
  <div>
    <p>A tool for transforming CSS with JavaScript.</p>
    <p><a href="https://postcss.org/" target="_blank" rel="noopener">PostCSS official website</a></p>
    <h4>Plugins:</h4>
  </div>
  <ul>
    <li><a href="https://github.com/postcss/autoprefixer" target="_blank" rel="noopener">Autoprefixer</a></li>
    <li><a href="https://preset-env.cssdb.org/" target="_blank" rel="noopener">PostCSS Preset Env</a></li>
    <!-- <li><a href="#">PostCSS usage in LocalPen</a></li> -->
  </ul>
  `,
  compiler: {
    url: 'vendor/postcss/postcss.js',
    factory: () => {
      const postCssOptions = { from: undefined };

      const loadedPlugins: { [key in PluginName]?: Plugin } = {};

      const loadPlugin = (pluginName: PluginName, baseUrl: string) => {
        const specs = getSpecs(pluginName);
        if (!specs || loadedPlugins[pluginName] != null) return;

        try {
          (self as any).importScripts(baseUrl + specs.url);
          const plugin = specs.factory();
          loadedPlugins[pluginName] = plugin;
        } catch {
          throw new Error('Failed to load PostCSS plugin: ' + pluginName);
        }
      };

      const getPlugins = (config: Pen, baseUrl: string) => {
        const configPlugins = config.processors.postcss;
        const isEnabled = (pluginName: PluginName) => configPlugins[pluginName] === true;
        const pluginNames = (Object.keys(configPlugins) as PluginName[]).filter(isEnabled);
        pluginNames.forEach((pluginName) => loadPlugin(pluginName, baseUrl));
        return pluginSpecs
          .filter((specs) => pluginNames.includes(specs.name))
          .map((specs) => loadedPlugins[specs.name]);
      };

      return async function process(code: string, config?: Pen, baseUrl?: string): Promise<string> {
        if (!config || !baseUrl) return code;
        const plugins = getPlugins(config, baseUrl);
        return (await (self as any).postcss.postcss(plugins).process(code, postCssOptions)).css;
      };
    },
    umd: true,
  },
  editors: ['style'],
};
