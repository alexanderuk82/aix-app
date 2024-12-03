/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ["lh3.googleusercontent.com", "gravatar.com"]
	},
	transpilePackages: ['@kinde-oss/kinde-auth-nextjs']
};

export default nextConfig;
