import { useState } from 'react'

interface FormData {
  server_url: string
  id: string
  pw: string
  mac: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: any
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    server_url: '',
    id: '',
    pw: '',
    mac: ''
  })
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/wol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data: ApiResponse = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : String(error)}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '0.5rem',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          WOL Relay Service
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          margin: 0
        }}>
          Wake-on-LAN 신호를 원격으로 전송하는 서비스입니다
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="server_url" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            Server URL
          </label>
          <input
            type="url"
            id="server_url"
            name="server_url"
            value={formData.server_url}
            onChange={handleChange}
            placeholder="http://your-server.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="id" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            Username
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="Enter your username"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="pw" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            Password
          </label>
          <input
            type="password"
            id="pw"
            name="pw"
            value={formData.pw}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="mac" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            MAC Address
          </label>
          <input
            type="text"
            id="mac"
            name="mac"
            value={formData.mac}
            onChange={handleChange}
            placeholder="XX:XX:XX:XX:XX:XX"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            required
          />
          <small style={{ 
            color: '#666', 
            fontSize: '0.9rem',
            marginTop: '0.25rem',
            display: 'block'
          }}>
            형식: XX:XX:XX:XX:XX:XX 또는 XX-XX-XX-XX-XX-XX
          </small>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            padding: '14px 20px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: loading ? 'none' : '0 2px 4px rgba(0,112,243,0.3)'
          }}
        >
          {loading ? '전송 중...' : 'WOL 신호 전송'}
        </button>
      </form>

      {result && (
        <div style={{
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h3 style={{ 
            margin: '0 0 0.5rem 0',
            color: result.success ? '#155724' : '#721c24',
            fontSize: '1.1rem'
          }}>
            {result.success ? '✅ 성공' : '❌ 오류'}
          </h3>
          <p style={{ 
            margin: '0 0 0.5rem 0',
            color: result.success ? '#155724' : '#721c24'
          }}>
            {result.message}
          </p>
          {result.data && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ 
                cursor: 'pointer',
                color: result.success ? '#155724' : '#721c24',
                fontWeight: '500'
              }}>
                상세 정보
              </summary>
              <pre style={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                padding: '0.75rem', 
                borderRadius: '4px',
                overflow: 'auto',
                marginTop: '0.5rem',
                fontSize: '0.9rem'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
