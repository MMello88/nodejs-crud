// models/RefreshToken.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('fairy', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

const RefreshToken = sequelize.define('RefreshToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  replacedByToken: {
    type: DataTypes.STRING,
    unique: true
  }
}, {});

RefreshToken.sync()
  .then(() => console.log('Tabela de refresh tokens criada com sucesso'))
  .catch(error => console.log('Erro ao criar a tabela de refresh tokens: ', error));

module.exports = RefreshToken;
