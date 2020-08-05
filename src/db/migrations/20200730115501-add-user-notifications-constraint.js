'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('user_notifications', {
      fields: ['user_uuid', 'd_app_uuid', 'notifications_uuid'],
      type: 'primary key',
      name: 'user_dapp_notifications_unique_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('user_notifications', 'user_dapp_notifications_unique_constraint');
  }
};