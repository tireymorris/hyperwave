module.exports = {
  apps: [
    {
      name: "hyperwave-server",
      script: "./dist/server",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
