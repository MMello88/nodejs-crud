const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance with database details
const sequelize = new Sequelize('fairy', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Define a Model for 'User' table
const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
});

User.sync()
  .then(() => console.log('Tabela de usuários criada com sucesso'))
  .catch(error => console.log('Erro ao criar a tabela de usuários: ', error));

  
module.exports = User;
