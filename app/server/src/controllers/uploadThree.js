const fs = require("fs");

const db = require("../models");
const Image = db.images;

const baseUrl = "http://localhost:3001/files/";

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.date + 'THIS IS THE DATE HOPEFULLY');
    console.log(req.file.date + 'THIS IS THE FILE DATE HOPEFULLYYYY')

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      //date: req.file.date
      data: fs.readFileSync(
        __basedir + "../../resources/static/assets/uploadsThree/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "../../resources/static/assets/tmpThree/" + image.name,
        image.data
      );

      return res.send(`File has been uploaded.`);

      
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
  
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "../../resources/static/assets/uploadsThree/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    
    console.log(files);
    
    console.log(files.lastModified);
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "../../resources/static/assets/uploadsThree/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  uploadFiles,
  getListFiles,
  download
};