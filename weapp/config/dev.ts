import type { UserConfigExport } from "@tarojs/cli";

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4000",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: "http://127.0.0.1:4000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
} satisfies UserConfigExport<"webpack5">;
