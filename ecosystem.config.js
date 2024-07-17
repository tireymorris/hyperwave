module.exports = {
  apps: [
    {
      name: "hyperwave-server",
      script: "./dist/server",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "hyperwave-worker",
      script: "./dist/worker",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
