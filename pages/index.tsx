import dynamic from 'next/dynamic'
import Head from 'next/head'

const HomeComponent = dynamic(() => import('../components/Home'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center'
    }}>
      <h1>WOL Relay Service</h1>
      <p>로딩 중...</p>
    </div>
  )
})

export default function Home() {
  return (
    <>
      <Head>
        <title>WOL Relay Service</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Wake-on-LAN 신호를 원격으로 전송하는 서비스입니다" />
      </Head>
      <HomeComponent />
    </>
  )
}