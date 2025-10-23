import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
    
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@patternfly-labs/react-form-wizard': path.resolve(__dirname, '../packages/react-form-wizard/src'),
        },
      },
    });

    // Add SCSS module support
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add regular SCSS rule
    config.module.rules.push({
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    const cssRuleIndex = config.module?.rules?.findIndex((rule) => {
      if (typeof rule !== "object" || rule === null || !("test" in rule)) {
        return false;
      }
      return rule.test instanceof RegExp && rule.test.test(".css");
    });

    if (cssRuleIndex !== undefined && cssRuleIndex !== -1 && config.module?.rules) {
      config.module.rules.splice(cssRuleIndex, 1);
    }

    // Add CSS Modules support
    config.module?.rules?.push(
      {
        test: /\.module\.s?css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
      }
    );
  },
};

export default config;