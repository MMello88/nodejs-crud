const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance with database details
const sequelize = new Sequelize('fairy', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Define a Model for 'User' table
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // This enforces uniqueness for the 'email' field
    validate: {
      isEmail: true, // This will validate that the email is in a valid format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, modelName: 'User'
});

User.sync()
  .then(() => console.log('Tabela de usuários criada com sucesso'))
  .catch(error => console.log('Erro ao criar a tabela de usuários: ', error));

  
module.exports = User;
