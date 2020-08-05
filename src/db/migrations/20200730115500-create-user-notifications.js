'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_notifications', {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        },
      user_uuid: {
        type: Sequelize.UUID,
        primaryKey: true
        },
      d_app_uuid: {
        type: Sequelize.UUID,
        primaryKey: true
        },
      notifications_uuid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_notifications');
  }
};