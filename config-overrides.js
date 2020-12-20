const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    modifyVars: {
      '@primary-color': '#1890ff',
      // '@primary-color': '#389e0d',
      '@layout-header-background': '#fff',
      '@layout-body-background': '#fff',
      '@page-header-padding': 0,
      '@border-radius-base': '6px'
    },
    javascriptEnabled: true
  }),
  (config) => {
    const paths = require('react-scripts/config/paths');
    // 配置打包目录输出到dist 目录中
    paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist/');
    config.output.path = paths.appBuild;
    return config
  },
);