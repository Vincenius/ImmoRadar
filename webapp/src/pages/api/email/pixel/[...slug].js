import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

const handler = async (req) => {
  const { searchParams } = new URL(req.url || '');
  const token = searchParams.get('slug')

  if (token) {
    fetch(`${process.env.BASE_URL}/api/email/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.API_KEY,
        token,
      }),
    })
  }


  return new ImageResponse(
    (<div></div>),
    {
      width: 10,
      height: 10,
    }
  )
}

export default handler