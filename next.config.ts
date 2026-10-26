import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 带版本号的简历地址：/v/<版本>/resume-zh.pdf → /resume-zh.pdf
  // 用路径而不是 ?v= 做版本号：Notion 等嵌入方换版本就会重新拉取，
  // 下载下来的文件名仍是干净的 resume-zh.pdf
  async rewrites() {
    return [{ source: "/v/:ver/:file", destination: "/:file" }];
  },
  async headers() {
    return [
      {
        source: "/:file(resume-zh|resume-zh-onsite|resume-en).pdf",
        headers: [
          { key: "Content-Disposition", value: 'inline; filename=":file.pdf"' },
          // 允许跨站读取，便于在招聘站表单里直接附上简历
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
