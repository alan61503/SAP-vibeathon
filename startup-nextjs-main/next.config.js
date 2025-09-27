/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Optimize images (Vercel handles this automatically)
  images: {
    domains: ['supabase.co'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle
  experimental: {
    optimizeCss: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;