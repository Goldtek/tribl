module.exports = {
  client: {
    name: 'Tribl',
    service: {
      name: 'Tribl',
      endpoint: null,
      localSchemaFile: path.resolve(__dirname, './test.graphql')
    },
    includes: ['./src/**/*.{ts,tsx,js,jsx,graphql}'],
    excludes: ['**/__tests__/**']
  }
};
