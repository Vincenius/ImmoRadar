import fs from 'fs';

const is_same = (array1.length == array2.length) && array1.every(function(element, index) {
  return element === array2[index];
});

const main = async () => {
  const result = [];
  const zipData = JSON.parse(fs.readFileSync('./zipData.json'))
  // const failedZips = zipData.filter(d => d.cityData.status === 429) // TODO fix broken

  const districts = zipData
    .map(z => z.zipData.map(d => ({ ...d, zip: z.zip }))).flat()
  const districtObj = {}

  for (let d of districts) {
    if (districtObj[d.name]) {
      districtObj[d.name].push(d.zip)
    } else {
      districtObj[d.name] = [d.zip]
    }

    // todo add city
  }

  Object.entries(districtObj).map(([key, value]) => {
    // todo
  })

  console.log(districtObj)

  // todo remove subthingys eg.
  // Wutach: [ '79879' ],
  // 'Wutach, Ewattingen': [ '79879' ],
  // 'Wutach, Lembach': [ '79879' ],
  // 'Wutach, Münchingen': [ '79879' ],
  // todo filter duplicate zips

  // DATA FETCHING
  // for (let zip of allZips) {
  //   console.log('processing', allZips.indexOf(zip))

  //   const [zipData, cityData] = await Promise.all([
  //     fetch(`https://www.plz-suche.org/api/?api_region=de&action=plz&term=${zip}`).then(res => res.json()),
  //     fetch(`https://zip-api.eu/api/v1/info/DE-${zip}`).then(res => res.json())
  //   ])

  //   result.push({ zip,  zipData, cityData })
  // }

  // fs.writeFileSync('./zipData.json', JSON.stringify(result))
}

await main()