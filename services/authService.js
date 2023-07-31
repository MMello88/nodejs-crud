const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.generateToken = async (id) => {
  const token = jwt.sign({ id }, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', { expiresIn: '1h' });
  return token;
};

exports.generateToken7d = async (id) => {
  const token = jwt.sign({ id }, '67e928cb32a47dd68902babaaf784656657b9038a34a06bdfe5010f5c2854f31', { expiresIn: '7d' });
  return token;
};

exports.authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f');
    req.user = await User.findByPk(decodedToken.id);

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    next();
  } catch {
    res.status(401).json({ message: 'Auth failed!' });
  }
};


/*

// Função para extrair o token dos cookies
const getTokenFromCookies = (req) => {
  if (req && req.cookies) {
    return req.cookies['token'];
  }
  return null;
};



// Middleware para autenticar o token JWT
const authenticateJWT = ejwt({secret: '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', algorithms: ['HS256'], getToken: getTokenFromCookies});


*/