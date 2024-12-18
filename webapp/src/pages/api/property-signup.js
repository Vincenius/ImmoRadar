const allowedBody = {
  "Firstname": "string",
  "Lastname": "string",
  "Email": "string",
  "Phone": "string",
  "Postalcode": "number",
  "City": "string",
  "Radius": "number",
  "ExcludeCity": "string",
  "MinSize": "number",
  "Budget": "number",
  "Comment": "string",
  "MaxSize": "number"
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = {};

      for (const [key, value] of Object.entries(JSON.parse(req.body))) {
        if (allowedBody[key]) { // only use allowed keys (todo better validation?)
          body[key] = value;
        }
      }

      const url = 'https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/records';
      const options = {
        method: 'POST',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      try {
        await fetch(url, options).then(res => res.json())

        res.status(200).json();
      } catch (err) {
        console.log('unexpected error on property signup', err)
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500)
    }
  } else {
    res.status(400).json([])
  }
}
