/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14에서는 appDir이 기본값이므로 experimental 설정 불필요
  reactStrictMode: false,
  swcMinify: true,
  
  // SSR 비활성화 (클라이언트 사이드 렌더링만 사용)
  trailingSlash: false,
  
  // Fast Refresh 문제 해결을 위한 설정
  experimental: {
    // Fast Refresh 안정성 향상
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Webpack 설정 최적화
  webpack: (config, { dev, isServer }) => {
    // 개발 환경에서 캐시 문제 해결
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }
    
    return config
  },
  
  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 체크 건너뛰기 (개발 중에는 ESLint로 충분)
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 오류가 있어도 계속 진행
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
