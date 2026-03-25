module.exports = {
  apps: [
    {
      name: "app1",
      script: "./dist/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
