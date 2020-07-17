module.exports = {
  client: {
    name: 'Tribl',
    service: {
      name: 'Tribl',
      url: 'http://52.53.172.167:9700/graphql'
    },
    includes: ['./src/**/*.{ts,tsx,js,jsx,graphql}'],
    excludes: ['**/__tests__/**']
  }
};
