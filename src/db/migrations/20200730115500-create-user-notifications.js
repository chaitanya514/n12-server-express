'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_notifications', {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
      },
      user_uuid: {
        allowNull: false,          
        type: Sequelize.UUID
        },
      d_app_uuid: {
        allowNull: false,          
        type: Sequelize.UUID
        },
      notifications_uuid: {
        allowNull: false,          
        type: Sequelize.UUID
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