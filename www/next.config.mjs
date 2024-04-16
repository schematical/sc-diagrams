/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
        /*loader: 'custom',
        loaderFile: './src/my-loader.tsx',*/
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i*.ytimg.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};
if(process.env.PUBLIC_ASSET_URL){
    nextConfig.assetPrefix =`${process.env.PUBLIC_ASSET_URL}/${process.env.ASSET_HASH}`;
}
export default nextConfig;
