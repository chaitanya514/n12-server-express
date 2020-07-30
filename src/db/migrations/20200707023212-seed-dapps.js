module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('dapps', [
      {
        uuid: '4c4c510c-f12c-4c62-b824-c511490f3a80',
        created_at: new Date(),
        updated_at: new Date(),
        name: 'Uniswap',
        description: 'Track rates for the Assets',
        logo_url: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1069.png'
      },
      {
        uuid: '5d7600b8-269e-4671-b4cb-bdc3cdd89731',
        created_at: new Date(),
        updated_at: new Date(),
        name: 'Aave',
        description: 'Track lending rates for various assets',
        logo_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2239.png'
      },
      {
        uuid: '0d4d4c2c-f403-4046-b07e-606a60af9f7f',
        created_at: new Date(),
        updated_at: new Date(),
        name: 'MakerDAO',
        description: 'CDPs, DAI Supply, Governance updates',
        logo_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png'
      }
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('dapps', null, {});
  }
};