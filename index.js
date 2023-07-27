const express = require('express');
const { Sequelize } = require('sequelize');
//const bodyParser = require('body-parser');
const cors = require('cors');

//routes
const userRoutes = require('./routes/userRoutes');

// Initialize the Sequelize instance with database details
const sequelize = new Sequelize('fairy', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'], // colocar aqui o ip externo e o nome do site
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

//app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

app.use('/api/users', userRoutes);

const PORT = 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // If you have other models defined, make sure to import them and sync here
    await sequelize.sync({ force: true });
    console.log("The tables for the models were just (re)created!");

    //run server
    app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
  
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();