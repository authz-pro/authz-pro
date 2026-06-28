const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

// Replaces patterns flagged by AMO validator with safe equivalents
class SafeBuildPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("SafeBuildPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "SafeBuildPlugin", stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE },
        (assets) => {
          for (const name of Object.keys(assets)) {
            if (!name.endsWith(".js")) continue;
            let source = assets[name].source();
            let changed = false;

            // new Function('return this') -> self (webpack runtime fallback)
            if (source.includes("new Function")) {
              source = source.replace(
                /return this \|\| new Function\('return this'\)\(\)/g,
                "return self"
              );
              changed = true;
            }

            // Vue runtime innerHTML for SVG elements -> DOMParser (not flagged by AMO)
            if (source.includes('svgContainer.innerHTML = "<svg>"')) {
              source = source.replace(
                /svgContainer\.innerHTML = "<svg>"\.concat\(cur, "<\/svg>"\);\s+var svg = svgContainer\.firstChild;/g,
                'var svg = new DOMParser().parseFromString("<svg>" + cur + "</svg>", "image/svg+xml").documentElement;\n                svgContainer.appendChild(svg);'
              );
              changed = true;
            }

            if (changed) {
              assets[name] = new compiler.webpack.sources.RawSource(source);
            }
          }
        }
      );
    });
  }
}

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    argon: "./src/argon.ts",
    background: "./src/background.ts",
    content: "./src/content.ts",
    popup: "./src/popup.ts",
    import: "./src/import.ts",
    options: "./src/options.ts",
    qrdebug: "./src/qrdebug.ts",
    permissions: "./src/permissions.ts",
  },
  module: {
    noParse: /\.wasm$/,
    rules: [
      {
        // argon2-browser overrides
        test: /\.wasm$/,
        loader: "base64-loader",
        type: "javascript/auto"
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {},
          }
        ]
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        extensions: {
          vue: true
        }
      }
    }),
    new SafeBuildPlugin()
  ],
  resolve: {
    extensions: [
      ".mjs",
      ".js",
      ".jsx",
      ".vue",
      ".json",
      ".wasm",
      ".ts",
      ".tsx"
    ],
    modules: ["node_modules"],
    fallback: {
      // Stop argon2-browser from trying to bring in node modules
      fs: false,
      path: false
    }
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    globalObject: "self"
  }
};
