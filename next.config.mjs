/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.fallback = {fs: false, net: false, tls: false};
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    transpilePackages: ['react-daisyui'],
    images: {
        unoptimized:true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cloudflare-ipfs.com',
                port: '',
                pathname: '/ipfs/**',
            },
        ],
    },

};
export default nextConfig;
