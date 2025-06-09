import headers from "@/utils/fetchHeader";

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query

      fetch(`${process.env.BASE_URL}/api/pdf-email`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          ...headers
        }
      })

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error', error)
    res.status(500).json({})
  }
}
