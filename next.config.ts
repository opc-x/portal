import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/resume": ["./app/resume/document.html"],
  },
  async redirects() {
    return [
      { source: "/resume/zh", destination: "/resume", permanent: true },
      { source: "/resume/onsite", destination: "/resume", permanent: true },
      { source: "/resume-zh.html", destination: "/resume", permanent: true },
      { source: "/resume-zh-onsite.html", destination: "/resume", permanent: true },
      { source: "/resume/pdf/zh", destination: "/resume", permanent: true },
      { source: "/resume/pdf/onsite", destination: "/resume", permanent: true },
      { source: "/resume/pdf/en", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/resume-en.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/resume-zh.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/resume-zh-onsite.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/v/:ver/resume-en.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/v/:ver/resume-zh.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
      { source: "/v/:ver/resume-zh-onsite.pdf", destination: "/Michael-Resume-EN-dtcpay-tech-remote.pdf", permanent: true },
    ];
  },
  // 带版本号的简历地址：/v/<版本>/<文件> → /<文件>
  // 用路径而不是 ?v= 做版本号：Notion 等嵌入方换版本就会重新拉取，
  // 下载下来的文件名仍是 Michael-Resume-EN-dtcpay-tech-remote.pdf
  async rewrites() {
    return [{ source: "/v/:ver/:file", destination: "/:file" }];
  },
  async headers() {
    return [
      {
        source: "/Michael-Resume-EN-dtcpay-tech-remote.pdf",
        headers: [
          { key: "Content-Disposition", value: 'inline; filename="Michael-Resume-EN-dtcpay-tech-remote.pdf"' },
          // 允许跨站读取，便于在招聘站表单里直接附上简历
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
