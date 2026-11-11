import type { NextConfig } from "next";

const PDF = "/Michael-Resume-EN-dtcpay-tech-remote.pdf";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/resume": ["./app/resume/document.html"],
  },
  async redirects() {
    return [
      { source: "/resume/pdf/en", destination: PDF, permanent: true },
      { source: "/resume-en.pdf", destination: PDF, permanent: true },
      { source: "/resume-zh.pdf", destination: PDF, permanent: true },
      { source: "/resume-zh-onsite.pdf", destination: PDF, permanent: true },
      { source: "/v/:ver/resume-en.pdf", destination: PDF, permanent: true },
      { source: "/v/:ver/resume-zh.pdf", destination: PDF, permanent: true },
      { source: "/v/:ver/resume-zh-onsite.pdf", destination: PDF, permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: PDF,
        headers: [
          { key: "Content-Disposition", value: 'inline; filename="Michael-Resume-EN-dtcpay-tech-remote.pdf"' },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
