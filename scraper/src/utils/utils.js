const resolutions = [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1600, height: 900 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1680, height: 1050 },
  { width: 2560, height: 1440 },
  { width: 1920, height: 1200 },
  { width: 1536, height: 864 },
  { width: 1360, height: 768 },
  { width: 1280, height: 1024 },
  { width: 2560, height: 1600 },
  { width: 3200, height: 1800 },
  { width: 2880, height: 1800 },
  { width: 3840, height: 2160 },
  { width: 1280, height: 600 },
  { width: 800, height: 600 },
  { width: 1280, height: 960 }
];

export const getRandomGeolocation = () => {
  const cities = [
      { name: 'Berlin', latMin: 52.3382, latMax: 52.6755, lonMin: 13.0884, lonMax: 13.7611 },
      { name: 'Hamburg', latMin: 53.3957, latMax: 53.5683, lonMin: 9.7575, lonMax: 10.1184 },
      { name: 'Munich', latMin: 48.0616, latMax: 48.2484, lonMin: 11.3608, lonMax: 11.7229 },
      { name: 'Cologne', latMin: 50.8303, latMax: 51.0846, lonMin: 6.7724, lonMax: 7.1620 },
      { name: 'Frankfurt', latMin: 50.0282, latMax: 50.1851, lonMin: 8.5212, lonMax: 8.8026 },
      { name: 'Stuttgart', latMin: 48.6710, latMax: 48.8340, lonMin: 9.0653, lonMax: 9.2827 },
      { name: 'Düsseldorf', latMin: 51.1634, latMax: 51.3116, lonMin: 6.6827, lonMax: 6.8676 },
      { name: 'Dortmund', latMin: 51.4582, latMax: 51.5641, lonMin: 7.4007, lonMax: 7.5713 },
      { name: 'Essen', latMin: 51.4039, latMax: 51.4909, lonMin: 6.9226, lonMax: 7.0808 },
      { name: 'Leipzig', latMin: 51.2672, latMax: 51.4159, lonMin: 12.2734, lonMax: 12.5506 }
  ];

  const randomIndex = Math.floor(Math.random() * cities.length);
  const city = cities[randomIndex];

  const randomLatitude = Math.random() * (city.latMax - city.latMin) + city.latMin;
  const randomLongitude = Math.random() * (city.lonMax - city.lonMin) + city.lonMin;

  return { latitude: randomLatitude, longitude: randomLongitude };
}

export const getRandomResolution = () => {
  const randomIndex = Math.floor(Math.random() * resolutions.length);
  return resolutions[randomIndex];
}

export const getRandomUseragent = () => {
  const commonUserAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15"
  ];
  const randomIndex = Math.floor(Math.random() * commonUserAgents.length);
  return commonUserAgents[randomIndex];
}

export const delay = ms => new Promise(res => setTimeout(res, ms));