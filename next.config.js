const withLess = require('next-with-less');

module.exports = withLess({
  env: {
    SYSTEM_NAME: 'TronPretty',
  },

  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        'primary-color': '#17B67F',
        'border-radius-base': '2px',
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tool/address',
        permanent: true,
      },
    ];
  },
});
