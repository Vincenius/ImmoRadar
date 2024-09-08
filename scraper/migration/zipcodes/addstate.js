import { MongoClient } from 'mongodb';

const main = async () => {
  const result = [];
  const client = new MongoClient('add here');

  try {
    await client.connect();
    const db = client.db('prod');
    const collection = db.collection('locations');
    let data = await collection.find({ "state": { $exists: false } }).toArray()

    while (data.length) {
      const codes = [...new Set(data.map(d => d.zipCodes).flat())]
      console.log('open elements', data.length, ' / ', codes.length)

      const zipData = await fetch(`https://zip-api.eu/api/v1/info/DE-${codes[0]}`).then(res => res.json());

      if (zipData.status === 429) {
        console.log('TOO MANY REQUESTS')
        break;
      } else {
        console.log('updating', codes[0])
        await collection.updateMany({ zipCodes: codes[0] }, { $set: { state: zipData.state } })
      }

      data = await collection.find({ "state": { $exists: false } }).toArray()
    }
  } catch (error) {
    console.error('ERROR', error)
  } finally {
    client.close();
  }
  // const zipData = JSON.parse(fs.readFileSync('./zipData.json'))

  // // START
  // const districts = zipData
  //   .map(z => z.zipData.map(d => ({ ...d, zip: z.zip }))).flat()
  //   .filter(z => z.level === 4)
  // const districtObj = {}
  // for (let d of districts) {
  //   if (districtObj[d.name]) {
  //     districtObj[d.name].push(d.zip)
  //   } else {
  //     districtObj[d.name] = [d.zip]
  //   }
  // }

  // // add zipData.city to districtObj
  // for (let d of zipData) {
  //   if (districtObj[d.cityData.place_name] && !districtObj[d.cityData.place_name].includes(d.zip)) {
  //     districtObj[d.cityData.place_name].push(d.zip)
  //   } else {
  //     districtObj[d.cityData.place_name] = [d.zip]
  //   }
  // }

  // fs.writeFileSync('./districtObj.json', JSON.stringify(districtObj))

  // const zipMap = {}
  // Object.entries(districtObj).map(([key, value]) => {
  //   const zips = value.sort((a,b) => b-a).join(',')
  //   if (zipMap[zips]) {
  //     zipMap[zips].push(key)
  //   } else {
  //     zipMap[zips] = [key]
  //   }
  // })

  // // console.log(zipMap['15806'])

  // const toRemove = Object.entries(zipMap).map(([key, value]) => {
  //   // sort values by string length starting with the shortest
  //   const sortedValues = value.sort((a,b) => a.length - b.length)
  //   // return all elements that include the shortest string except the original short string
  //   if (value.length > 1 && value.every(element => element.includes(sortedValues[0]))) {
  //     return value.slice(1)
  //   } else {
  //     return []
  //   }
  // }).flat()

  // const finalDistricts = {}
  // for (let d of districts) {
  //   if (!toRemove.includes(d.name)) {
  //     if (finalDistricts[d.name]) {
  //       finalDistricts[d.name].push(d.zip)
  //     } else {
  //       finalDistricts[d.name] = [d.zip]
  //     }
  //   }
  // }

  // // sort final districts by key name
  // const sorted = Object.entries(finalDistricts).sort((a,b) => a[0].localeCompare(b[0])).reduce((acc, [key, value]) => {
  //   acc[key] = value
  //   return acc
  // }, {})
  // fs.writeFileSync('./finalDistricts.json', JSON.stringify(sorted))

  // console.log(finalDistricts)

  // DATA FETCHING
  // let i = 0;
  // for (let zip of failedZips) {
  //   i++;
  //   console.log('processing', i, 'of', failedZips.length)

  //   const cityData = await fetch(`https://zip-api.eu/api/v1/info/DE-${zip.zip}`).then(res => res.json());
  //   await wait(1000)

  //   console.log(cityData.status === 429 ? 'FAILED' : 'SUCCESS')

  //   // const [zipData, cityData] = await Promise.all([
  //   //   fetch(`https://www.plz-suche.org/api/?api_region=de&action=plz&term=${zip}`).then(res => res.json()),
  //   //   fetch(`https://zip-api.eu/api/v1/info/DE-${zip}`).then(res => res.json())
  //   // ])

  //   result.push({ zip: zip.zip, cityData })
  // }

  // fs.writeFileSync('./zipData2.json', JSON.stringify(result))

  // const zipData = JSON.parse(fs.readFileSync('./districtObj.json'))

  // const mappedData = Object.entries(zipData).map(([key, value]) => {
  //   return {
  //     name: key,
  //     zipCodes: value
  //   }
  // })



  // await collection.insertMany(mappedData)

  // client.close();

  console.log('DONE')
}

await main()