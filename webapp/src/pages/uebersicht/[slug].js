import React from 'react'
import ErrorPage from 'next/error'
import { MongoClient } from 'mongodb';
import Layout from '@/components/Layout/Layout';
import SearchPages from '@/components/SearchPages/SearchPages';
import { Title } from '@mantine/core';

const regionData = {
  'baden-württemberg': 'Baden-Württemberg',
  'bayern': 'Bayern',
  'brandenburg': 'Brandenburg',
  'bremen': 'Bremen',
  'berlin': 'Berlin',
  'hamburg': 'Hamburg',
  'hessen': 'Hessen',
  'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
  'niedersachsen': 'Niedersachsen',
  'nordrhein-westfalen': 'Nordrhein-Westfalen',
  'rheinland-pfalz': 'Rheinland-Pfalz',
  'saarland': 'Saarland',
  'sachsen': 'Sachsen',
  'sachsen-anhalt': 'Sachsen-Anhalt',
  'schleswig-holstein': 'Schleswig-Holstein',
  'thüringen': 'Thüringen',
}

const Berlin = ({ region, result }) => {
  if (!regionData[region] || result.length === 0) {
    return <ErrorPage statusCode={404} />
  }

  const regionName = regionData[region]

  const title = `Alle Gebiete mit verfügbaren Wohnungen in ${regionName} | ImmoRadar`
  const description = `Eine Übersicht aller Gebiete mit verfügbaren Wohnungen in ${regionName}`

  return <Layout title={title} description={description}>
    <Title order={1} my="xl">Alle Gebiete mit verfügbaren Wohnungen in {regionName}</Title>
    <SearchPages
      margin="xs"
      data={result.map(el => ({ primary: { label: `${el.name} [${el.count}]`, url: `/search?q=${encodeURI(el.name)}` } }))}
    />
  </Layout>
}

export const getServerSideProps = async (context) => {
  const { slug } = context.params;
  let result = [];
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('locations');
    const estateCollection = db.collection('estates');
    const regions = await collection.aggregate([
      {
        $match: {
          state: regionData[slug]
        }
      },
      {
        $project: {
          name: 1,
          zipCodes: 1,
          zipCodeCount: { $size: "$zipCodes" }
        }
      },
      {
        $sort: { zipCodeCount: -1 }
      },
      {
        $project: {
          name: 1,
          zipCodes: 1,
          _id: 0
        }
      }
    ]).toArray()

    const allZipCodes = regions.map(item => item.zipCodes).flat()
    const zipCodeEstateCount = await estateCollection.aggregate([
      {
        $match: {
          'address.zipCode': { $in: allZipCodes }
        }
      },
      {
        $group: {
          _id: "$address.zipCode",
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    const existingZipCodes = zipCodeEstateCount.filter(item => item.count > 0).map(item => item._id)
    result = regions
      .filter(loc => loc.zipCodes.some(zip => existingZipCodes.includes(zip)))
      .map(loc => ({
        name: loc.name,
        count: loc.zipCodes.reduce((acc, curr) => acc + (zipCodeEstateCount.find(item => item._id === curr)?.count || 0), 0)
      }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('region page error', error)
  } finally {
    client.close();
  }
  return {
    props: {
      region: slug,
      result
    }
  }
}

export default Berlin
