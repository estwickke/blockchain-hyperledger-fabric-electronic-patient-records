/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 12:44:51
 * @modify date 2021-03-14 21:24:41
 * @desc Doctor specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {ROLE_DOCTOR, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../patient-asset-transfer/application-javascript/app.js');
const e = require('express');


/**
 * @param  {Request} req Body must be a json, role in the header and patientId in the url
 * @param  {Response} res A 200 response if patient is updated successfully else a 500 response with s simple message json
 * @description Updates an existing asset(patient medical details) in the ledger. This method can be executed only by the doctor.
 */
exports.updatePatientMedicalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  let args = req.body;
  args.patientId = req.params.patientId;
  args.changedBy = req.headers.username;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updatePatientMedicalDetails', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Patient.'));
};

exports.uploadImage = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);

  req.body.uploadedBy = req.headers.username;

  // The request present in the body is converted into a single json string
  const data = JSON.stringify(req.body);
  const args = [data];
  // Invoke the smart contract function
  const createImageRes = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:uploadImage', args);
  if (createImageRes.error) {
    res.status(400).send(response.error);
  }
};
  
  
exports.transferImage = async (req, res) => {
  // User role from the request header is validated
  const userRole = ROLE_DOCTOR;
 // await validateRole([ROLE_DOCTOR], userRole, res);
  //let args = req.body;
  const data = JSON.stringify(req.body);
  const args = [data];

  const dataParsed = JSON.parse(data);
  console.log(JSON.stringify(dataParsed.ownerHosp) + '161616161616161');
  console.log(JSON.stringify(data) + '6161616166161616616');

  let databaseTarget = dataParsed.ownerHosp;
  const database = databaseTarget.substring(0,5);
  console.log(database + 'DATABASE');

  if (database === 'hosp1'){
    args.uploadedBy = req.headers.username;
    // Set up and connect to Fabric Gateway
    const networkObj = await network.connectToNetwork(req.headers.username);
    // Invoke the smart contract function
    // Getting held up here, target whats returning error 500,  Error: Illegal value for keyvalue element of type string: undefined (not a string)
    const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:transferImageHosp1', args); //compare args here w similar func in admin routes
    (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Transferred Image.'));
  }
  else if(database === 'hosp2'){
    args.uploadedBy = req.headers.username;
    // Set up and connect to Fabric Gateway
    const networkObj = await network.connectToNetwork(req.headers.username);
    // Invoke the smart contract function
    // Getting held up here, target whats returning error 500,  Error: Illegal value for keyvalue element of type string: undefined (not a string)
    const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:transferImageHosp2', args); //compare args here w similar func in admin routes
    (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Transferred Image.'));
  }
  else if(database === 'hosp3'){
    args.uploadedBy = req.headers.username;
    // Set up and connect to Fabric Gateway
    const networkObj = await network.connectToNetwork(req.headers.username);
    // Invoke the smart contract function
    // Getting held up here, target whats returning error 500,  Error: Illegal value for keyvalue element of type string: undefined (not a string)
    const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:transferImageHosp3', args); //compare args here w similar func in admin routes
    (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Transferred Image.'));
  }

};

exports.getRecentTransactionID = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res)
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:getRecentTransactionID');
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Patient.'));
};

exports.queryAllTransferredImagesHosp1= async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  //console.log(req + '7676767676767676767');
  const data = JSON.stringify(req.body);
  const dataParsed = JSON.parse(data);

  const hospitalId = parseInt(req.params.hospitalId);

  console.log(hospitalId);

  console.log(data + '108080');

  console.log(JSON.stringify(dataParsed.transferredBy) + '161616161616161');

  await validateRole([ROLE_DOCTOR], userRole, res);
  //console.log(ownerHosp);
  //console.log(req.body + '108080808080808080');
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllTransferredImagesHosp1');
  //const parsedResponse = await JSON.parse(response);
  //console.log(response + '84848484848484848484');
  //console.log(JSON.parse(response));
  //console.log(JSON.stringify(response));
  //console.log(JSON.parse(JSON.stringify(response)));
  //const stringImage = JSON.stringify(parsedResponse);
  //console.log(stringImage + '8787878787887878878787878');
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(JSON.parse(response));
};

exports.queryAllTransferredImagesHosp2= async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  //console.log(req + '7676767676767676767');
  const data = JSON.stringify(req.body);
  const dataParsed = JSON.parse(data);

  const hospitalId = parseInt(req.params.hospitalId);

  console.log(hospitalId);

  console.log(data + '108080');

  console.log(JSON.stringify(dataParsed.transferredBy) + '161616161616161');

  await validateRole([ROLE_DOCTOR], userRole, res);
  //console.log(ownerHosp);
  //console.log(req.body + '108080808080808080');
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllTransferredImagesHosp2');
  //const parsedResponse = await JSON.parse(response);
  //console.log(response + '84848484848484848484');
  //console.log(JSON.parse(response));
  //console.log(JSON.stringify(response));
  //console.log(JSON.parse(JSON.stringify(response)));
  //const stringImage = JSON.stringify(parsedResponse);
  //console.log(stringImage + '8787878787887878878787878');
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(JSON.parse(response));
};

exports.queryAllTransferredImagesHosp3= async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  //console.log(req + '7676767676767676767');
  const data = JSON.stringify(req.body);
  const dataParsed = JSON.parse(data);

  const hospitalId = parseInt(req.params.hospitalId);

  console.log(hospitalId);

  console.log(data + '108080');

  console.log(JSON.stringify(dataParsed.transferredBy) + '161616161616161');

  await validateRole([ROLE_DOCTOR], userRole, res);
  //console.log(ownerHosp);
  //console.log(req.body + '108080808080808080');
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllTransferredImagesHosp3');
  //const parsedResponse = await JSON.parse(response);
  //console.log(response + '84848484848484848484');
  //console.log(JSON.parse(response));
  //console.log(JSON.stringify(response));
  //console.log(JSON.parse(JSON.stringify(response)));
  //const stringImage = JSON.stringify(parsedResponse);
  //console.log(stringImage + '8787878787887878878787878');
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(JSON.parse(response));
};


/**
 * @param  {Request} req role in the header and hospitalId, doctorId in the url
 * @param  {Response} res A 200 response if doctor is present else a 500 response with a error json
 * @description This method retrives an existing doctor
 */
exports.getDoctorById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  const userId = hospitalId === 1 ? 'hosp1admin' : hospitalId === 2 ? 'hosp2admin' : 'hosp3admin';
  const doctorId = req.params.doctorId;
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllDoctorsByHospitalId(networkObj, hospitalId);
  // Filter the result using the doctorId
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(response.filter(
    function(response) {
      return response.id === doctorId;
    },
  )[0]);
};