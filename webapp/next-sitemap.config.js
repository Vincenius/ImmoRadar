const exclude = ['/deleted', '/search', '/profile']

module.exports = {
    siteUrl: 'https://immoradar.xyz',
    generateRobotsTxt: true,
    exclude: exclude,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                disallow: exclude,
            },
        ],
    },
}