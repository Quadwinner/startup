/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        '@mapbox/node-pre-gyp': false,
        'canvas': false,
        'mongodb-client-encryption': false,
        aws4: false,
      };
    }
    return config;
  },
};

export default nextConfig; 