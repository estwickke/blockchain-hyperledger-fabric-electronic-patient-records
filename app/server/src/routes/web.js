const express = require("express");
const router = express.Router();
//const homeController = require("../controllers/home");
const uploadControllerOne = require("../controllers/uploadOne");
const uploadOne = require("../middleware/uploadOne");

const uploadControllerTwo = require("../controllers/uploadTwo");
const uploadTwo = require("../middleware/uploadTwo");

const uploadControllerThree = require("../controllers/uploadThree");
const uploadThree = require("../middleware/uploadThree");

let routes = (app) => {
  //router.get("/", homeController.getHome);

  router.post("/uploadHosp1", uploadOne.single("file"), uploadControllerOne.uploadFiles);

  router.post("/uploadHosp2", uploadTwo.single("file"), uploadControllerTwo.uploadFiles);

  router.post("/uploadHosp3", uploadThree.single("file"), uploadControllerThree.uploadFiles);

  router.post("/transferLedger", uploadControllerOne.transferLedger);

  router.get("/getTransferLedger", uploadControllerOne.getTransferLedger);

  router.get("/filesHosp1", uploadControllerOne.getListFiles);
  
  router.get("/filesHosp2", uploadControllerTwo.getListFiles);

  router.get("/filesHosp3", uploadControllerThree.getListFiles);

  router.get("/filesHosp1/:name", uploadControllerOne.download);

  router.get("/filesHosp2/:name", uploadControllerTwo.download);

  router.get("/filesHosp3/:name", uploadControllerThree.download);

  return app.use("/", router);
};

module.exports = routes;