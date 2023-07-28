const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var { expressjwt: ejwt } = require("express-jwt");
const { Sequelize } = require('sequelize');
const cors = require('cors');

//models
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');

//routes
const userRoutes = require('./routes/userRoutes');

// Initialize the Sequelize instance with database details
const sequelize = new Sequelize('fairy', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

const app = express();

app.use(cors({
  origin: ['http://localhost:3001','http://localhost:3000'], // colocar aqui o ip externo e o nome do site
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

//app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

// Proteja todas as rotas, exceto /login
app.use(ejwt({ secret: '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', algorithms: ['HS256'] }).unless({ path: ['/api/login', '/api/users'] }));

app.post('/api/login', async (req, res) => {
  // Autentique o usuário
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: `Nome ou senha inválidos` });
  }

  // Crie o token JWT
  const token = jwt.sign({ userId: user.id }, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', { expiresIn: '1h' });  
  const refreshToken = jwt.sign({ userId: user.id }, '67e928cb32a47dd68902babaaf784656657b9038a34a06bdfe5010f5c2854f31', { expiresIn: '7d' });

  // Armazene o refresh token no banco de dados
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias a partir de agora
  });


  res.json({ token, refreshToken });

});

// Rota de atualização do token
app.post('/api/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token é necessário!' });
  }

  const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

  if (!storedToken || storedToken.revoked) {
    return res.status(403).json({ error: 'Refresh token inválido!' });
  }

  jwt.verify(refreshToken, '67e928cb32a47dd68902babaaf784656657b9038a34a06bdfe5010f5c2854f31', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Refresh token inválido!' });
    }

    const token = jwt.sign({ userId: user.userId }, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', { expiresIn: '1h' });

    // Marque o token antigo como revogado e armazene o novo token
    storedToken.revoked = true;
    storedToken.replacedByToken = token;
    storedToken.save();
    
    res.json({ token });
  });
});

app.use('/api', userRoutes);

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