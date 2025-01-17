/* eslint-disable new-cap */
/**
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */


// Classes for Node Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtSecretToken = 'password';
const refreshSecretToken = 'refreshpassword';
let refreshTokens = [];

// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// Express Application init
const app = express();
const db = require("./models");
const initRoutes = require("./routes/web");

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(morgan('combined'));
app.use(bodyParser.json());
//changed from cors to corsOptions
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

db.sequelize.sync();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
//app.listen(3001, () => console.log('Backend server running on 3001'));

// Bring key classes into scope
const patientRoutes = require('./patient-routes');
const doctorRoutes = require('./doctor-routes');
const adminRoutes = require('./admin-routes');
//const imageRoutes = require('./routes/web')
const {ROLE_DOCTOR, ROLE_ADMIN, ROLE_PATIENT, CHANGE_TMP_PASSWORD} = require('../utils');
const {createRedisClient, capitalize, getMessage} = require('../utils');
const network = require('../../patient-asset-transfer/application-javascript/app.js');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token === '' || token === 'null') {
      return res.status(401).send('Unauthorized request: Token is missing');
    }
    jwt.verify(token, jwtSecretToken, (err, user) => {
      if (err) {
        return res.status(403).send('Unauthorized request: Wrong or expired token found');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send('Unauthorized request: Token is missing');
  }
};

/**
 * @description Generates a new accessToken
 */
function generateAccessToken(username, role) {
  return jwt.sign({username: username, role: role}, jwtSecretToken, {expiresIn: '5m'});
}

/**
 * @description Login and create a session with and add two variables to the session
 */
app.post('/login', async (req, res) => {
  // Read username and password from request body
  let {username, password, hospitalId, role} = req.body;
  hospitalId = parseInt(hospitalId);
  let user;
  // using get instead of redis GET for async
  if (role === ROLE_DOCTOR || role === ROLE_ADMIN) {
    // Create a redis client based on the hospital ID
    const redisClient = await createRedisClient(hospitalId);
    // Async get
    const value = await redisClient.get(username);
    // comparing passwords
    user = value === password;
    redisClient.quit();
  }

  if (role === ROLE_PATIENT) {
    const networkObj = await network.connectToNetwork(username);
    const newPassword = req.body.newPassword;

    if (newPassword === null || newPassword === '') {
      const value = crypto.createHash('sha256').update(password).digest('hex');
      const response = await network.invoke(networkObj, true, capitalize(role) + 'Contract:getPatientPassword', username);
      if (response.error) {
        res.status(400).send(response.error);
      } else {
        const parsedResponse = await JSON.parse(response);
        if (parsedResponse.password.toString('utf8') === value) {
          (!parsedResponse.pwdTemp) ?
            user = true :
            res.status(200).send(getMessage(false, CHANGE_TMP_PASSWORD));
        }
      }
    } else {
      let args = ({
        patientId: username,
        newPassword: newPassword,
      });
      args = [JSON.stringify(args)];
      const response = await network.invoke(networkObj, false, capitalize(role) + 'Contract:updatePatientPassword', args);
      (response.error) ? res.status(500).send(response.error) : user = true;
    }
  }

  if (user) {
    // Generate an access token
    const accessToken = generateAccessToken(username, role);
    const refreshToken = jwt.sign({username: username, role: role}, refreshSecretToken);
    refreshTokens.push(refreshToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).send({error: 'Username or password incorrect!'});
  }
});

/**
 * @description Creates a new accessToken when refreshToken is passed in post request
 */
app.post('/token', (req, res) => {
  const {token} = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshSecretToken, (err, username) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({username: username, role: req.headers.role});
    res.json({
      accessToken,
    });
  });
});

/**
 * @description Logout to remove refreshTokens
 */
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
  res.sendStatus(204);
});

app.get('/transactionRecord', (req, res) => {
  class transactionRecord {
  
    constructor(date,time,hash) {
      this.date = date;
      this.time = time
      this.hash = hash
    }
  
  
  }
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var date = new Date();
  var dateMonth = months[date.getMonth()] + ' ' +date.getDate();
  var time = date.getHours() +":"+date.getMinutes();
  var hash = "asdfeadfadf";
  const transaction = new transactionRecord(dateMonth,time,hash);
  console.log(transaction+'21717171771717');
    res.send(transaction)
  })
  

// //////////////////////////////// Admin Routes //////////////////////////////////////
app.post('/doctors/register', authenticateJWT, adminRoutes.createDoctor);
app.get('/patients/_all', authenticateJWT, adminRoutes.getAllPatients);
app.post('/patients/register', authenticateJWT, adminRoutes.createPatient);

// //////////////////////////////// Doctor Routes //////////////////////////////////////
app.patch('/patients/:patientId/details/medical', authenticateJWT, doctorRoutes.updatePatientMedicalDetails);
app.get('/doctors/:hospitalId([0-9]+)/:doctorId(HOSP[0-9]+\-DOC[0-9]+)', authenticateJWT, doctorRoutes.getDoctorById);

app.post('/doctors/transfer', authenticateJWT, doctorRoutes.transferImage);
app.post('/doctors/transferLedger', authenticateJWT, doctorRoutes.transferLedger);
app.get('/doctors/getTransferLedger', authenticateJWT, doctorRoutes.getTransferLedger);
app.post('/doctors/postTransferLedger', authenticateJWT, doctorRoutes.postTransferLedger);
app.post('/doctors/transaction', authenticateJWT, doctorRoutes.postTransactionID);
app.get('/doctors/getTransaction', authenticateJWT, doctorRoutes.getTransactionID);
app.get('/doctors/allTransferredImagesHosp1', authenticateJWT, doctorRoutes.queryAllTransferredImagesHosp1);
app.get('/doctors/allTransferredImagesHosp2', authenticateJWT, doctorRoutes.queryAllTransferredImagesHosp2);
app.get('/doctors/allTransferredImagesHosp3', authenticateJWT, doctorRoutes.queryAllTransferredImagesHosp3);

app.get('/doctors/transactionID', authenticateJWT, doctorRoutes.getRecentTransactionID);

// //////////////////////////////// Patient Routes //////////////////////////////////////
app.get('/patients/:patientId', authenticateJWT, patientRoutes.getPatientById);
app.patch('/patients/:patientId/details/personal', authenticateJWT, patientRoutes.updatePatientPersonalDetails);
app.get('/patients/:patientId/history', authenticateJWT, patientRoutes.getPatientHistoryById);
app.get('/doctors/:hospitalId([0-9]+)/_all', authenticateJWT, patientRoutes.getDoctorsByHospitalId);
app.patch('/patients/:patientId/grant/:doctorId', authenticateJWT, patientRoutes.grantAccessToDoctor);
app.patch('/patients/:patientId/revoke/:doctorId', authenticateJWT, patientRoutes.revokeAccessFromDoctor);