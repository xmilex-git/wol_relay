# WOL Relay Service

Wake-on-LAN 신호를 원격으로 전송하는 웹 서비스입니다. 서버 URL, 사용자명, 비밀번호, MAC 주소를 입력받아 해당 서버에 로그인하고 WOL 신호를 전송합니다.

## 주요 기능

- 🌐 웹 기반 WOL 신호 전송
- 🔐 서버 인증 (사용자명/비밀번호 기반)
- ✅ MAC 주소 형식 검증
- 🎨 현대적이고 직관적인 UI
- 📱 반응형 디자인
- 🔍 상세한 에러 핸들링 및 로깅
- 🚀 Vercel 배포 지원

## API 사용법

### 엔드포인트
```
POST /api/wol
```

### 요청 본문
```json
{
  "server_url": "http://your-server.com",
  "id": "your_username",
  "pw": "your_password", 
  "mac": "XX:XX:XX:XX:XX:XX"
}
```

### 응답
```json
{
  "success": true,
  "message": "WOL signal sent successfully",
  "data": {
    "mac_address": "XX:XX:XX:XX:XX:XX",
    "server_url": "http://your-server.com"
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "Authentication failed: No session ID found in login response"
}
```

## 로컬 개발

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## Vercel 배포

1. Vercel CLI 설치:
```bash
npm i -g vercel
```

2. 프로젝트 디렉토리에서 배포:
```bash
vercel
```

3. 환경 변수 설정 (필요시)

## 사용 예시

### cURL
```bash
curl -X POST https://your-domain.vercel.app/api/wol \
  -H "Content-Type: application/json" \
  -d '{
    "server_url": "http://your-server.com",
    "id": "your_username",
    "pw": "your_password",
    "mac": "XX:XX:XX:XX:XX:XX"
  }'
```

### JavaScript
```javascript
const response = await fetch('/api/wol', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    server_url: 'http://your-server.com',
    id: 'your_username',
    pw: 'your_password',
    mac: 'XX:XX:XX:XX:XX:XX'
  })
});

const result = await response.json();
console.log(result);
```

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Deployment**: Vercel
- **Styling**: 인라인 CSS (현대적 디자인)

## 보안 고려사항

- 입력값 검증 (URL, MAC 주소 형식)
- 에러 메시지에서 민감한 정보 제외
- 세션 ID 기반 인증
- curl 명령어 실행 시 안전한 파라미터 전달