module.exports = {
  apps: [
    {
      env_prod: {
        NODE_ENV: 'production',
      },
      name: 'Web App for SANE Scanner',
      script: 'index.js',
      watch: 'false',
    },
  ],
};
