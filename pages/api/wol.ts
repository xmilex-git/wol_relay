import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface WolRequest {
  server_url: string
  id: string
  pw: string
  mac: string
}

interface WolResponse {
  success: boolean
  message: string
  data?: any
}

interface LoginResponse {
  result: string
  session_id?: string
}

interface WolSignalResponse {
  result: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WolResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    })
  }

  const { server_url, id, pw, mac }: WolRequest = req.body

  // 필수 파라미터 검증
  if (!server_url || !id || !pw || !mac) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: server_url, id, pw, mac'
    })
  }

  // URL 형식 검증
  try {
    new URL(server_url)
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Invalid server URL format'
    })
  }

  // MAC 주소 형식 검증 (더 엄격한 검증)
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  if (!macRegex.test(mac)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid MAC address format. Expected format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX'
    })
  }

  try {
    console.log('Starting WOL relay process...')
    console.log('Server URL:', server_url)
    console.log('MAC Address:', mac)

    // 1단계: 로그인 요청 (curl 명령어 사용)
    console.log('Step 1: Sending login request...')
    const loginCommand = `curl -s -i -X POST "${server_url}/cgi/service.cgi" \\
      -H "Content-Type: application/json; charset=utf-8" \\
      -H "Accept: */*" \\
      -H "Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7" \\
      -H "Cache-Control: no-store" \\
      -H "Origin: ${server_url}" \\
      -H "Referer: ${server_url}/ui/" \\
      -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" \\
      -d '{"method":"session/login","params":{"id":"${id}","pw":"${pw}"}}'`

    const { stdout: loginOutput, stderr: loginError } = await execAsync(loginCommand)
    
    if (loginError) {
      console.error('Login command error:', loginError)
      return res.status(500).json({
        success: false,
        message: 'Failed to execute login command'
      })
    }

    console.log('Login response received')

    // efm_session_id 쿠키 추출
    const sessionIdMatch = loginOutput.match(/efm_session_id=([^;]+)/)
    if (!sessionIdMatch) {
      console.error('No session ID found in login response')
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No session ID found in login response'
      })
    }

    const sessionId = sessionIdMatch[1]
    console.log('Session ID extracted successfully')

    // 2단계: WOL 신호 전송
    console.log('Step 2: Sending WOL signal...')
    const wolCommand = `curl -s -i -X POST "${server_url}/cgi/service.cgi" \\
      -H "Content-Type: application/json; charset=utf-8" \\
      -H "Accept: */*" \\
      -H "Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7" \\
      -H "Cache-Control: no-store" \\
      -H "Origin: ${server_url}" \\
      -H "Referer: ${server_url}/ui/wol" \\
      -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" \\
      -H "Cookie: efm_session_id=${sessionId}" \\
      -d '{"method":"wol/signal","params":["${mac}"]}'`

    const { stdout: wolOutput, stderr: wolError } = await execAsync(wolCommand)
    
    if (wolError) {
      console.error('WOL command error:', wolError)
      return res.status(500).json({
        success: false,
        message: 'Failed to execute WOL command'
      })
    }

    console.log('WOL response received')

    // 응답에서 성공 여부 확인
    if (wolOutput.includes('{"result":"done"}') || wolOutput.includes('200 OK')) {
      console.log('WOL signal sent successfully')
      return res.status(200).json({
        success: true,
        message: 'WOL signal sent successfully',
        data: {
          mac_address: mac,
          server_url: server_url
        }
      })
    } else {
      console.error('WOL signal failed:', wolOutput)
      return res.status(500).json({
        success: false,
        message: 'WOL signal failed. Please check the server response.',
        data: {
          response: wolOutput
        }
      })
    }

  } catch (error) {
    console.error('WOL relay error:', error)
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error instanceof Error ? error.message : String(error)}`
    })
  }
}
