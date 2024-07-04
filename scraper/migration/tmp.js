import fs from 'fs';

// wait function
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  const result = [];
  const zipData = JSON.parse(fs.readFileSync('./zipData.json'))
  const failedZips = zipData.filter(d => d.cityData.status === 429)

  // const zipData2 = JSON.parse(fs.readFileSync('./zipData2.json'))
  // const mergedData = []

  // for (let z of zipData) {
  //   if (z.cityData.status === 429) {
  //     const z2 = zipData2.find(d => d.zip === z.zip)
  //     mergedData.push({
  //       ...z,
  //       cityData: z2.cityData
  //     })
  //   } else {
  //     mergedData.push(z)
  //   }
  // }
  // console.log(zipData.length, mergedData.length, failedZips.length)

  // todo merge zipData & zipData2

  // START
  // const districts = zipData
  //   .map(z => z.zipData.map(d => ({ ...d, zip: z.zip }))).flat()
  // const districtObj = {}
  // for (let d of districts) {
  //   if (districtObj[d.name]) {
  //     districtObj[d.name].push(d.zip)
  //   } else {
  //     districtObj[d.name] = [d.zip]
  //   }
  //   // todo add city
  // }
  
  // add zipData.city to districtObj
  // for (let d of zipData) {
  //   if (districtObj[d.cityData.place_name] && !districtObj[d.cityData.place_name].includes(d.zip)) {
  //     districtObj[d.cityData.place_name].push(d.zip)
  //   } else {
  //     districtObj[d.cityData.place_name] = [d.zip]
  //   }
  // }

  // const zipMap = {}
  // Object.entries(districtObj).map(([key, value]) => {
  //   const zips = value.sort((a,b) => b-a).join(',')
  //   if (zipMap[zips]) {
  //     zipMap[zips].push(key)
  //   } else {
  //     zipMap[zips] = [key]
  //   }
  // })

  // // console.log(Object.keys(zipMap).length)
  // const toRemove = Object.entries(zipMap).map(([key, value]) => {
  //   if (value.length > 1 && value.every(element => element.includes(value[0]))) {
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
  // END__


  // DATA FETCHING
  let i = 0;
  for (let zip of failedZips) {
    i++;
    console.log('processing', i, 'of', failedZips.length)

    const cityData = await fetch(`https://zip-api.eu/api/v1/info/DE-${zip.zip}`).then(res => res.json());
    await wait(1000)

    console.log(cityData.status === 429 ? 'FAILED' : 'SUCCESS')

    // const [zipData, cityData] = await Promise.all([
    //   fetch(`https://www.plz-suche.org/api/?api_region=de&action=plz&term=${zip}`).then(res => res.json()),
    //   fetch(`https://zip-api.eu/api/v1/info/DE-${zip}`).then(res => res.json())
    // ])

    result.push({ zip: zip.zip, cityData })
  }

  fs.writeFileSync('./zipData2.json', JSON.stringify(result))
}

await main()