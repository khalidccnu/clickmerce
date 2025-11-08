/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'antd',
    '@ant-design',
    '@ant-design/icons',
    'rc-util',
    'rc-picker',
    'rc-pagination',
    'rc-tree',
    'rc-table',
    'rc-input',
  ],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/auth',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
