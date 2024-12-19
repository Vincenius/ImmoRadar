import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.query;

    try {
        const url = `https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/records?where=(Token,eq,${token})`;
        const options = {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
        };

        const { list } = await fetch(url, options).then(res => res.json())
        
        if (list[0] && list[0].Id) {
            const url = `https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/records`;
            const options = {
                method: 'PATCH',
                headers: {
                    'xc-token': process.env.NOCODB_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Id: list[0].Id, Confirmed: true })
            };
            await fetch(url, options).then(res => res.json())
            return res.redirect(`/email-bestaetigt`)
        } else {
            return res.redirect(`/unerwarteter-fehler`)
        }
    } catch (error) {
        console.error(error);
        return res.redirect(`/unerwarteter-fehler`)
    }
}