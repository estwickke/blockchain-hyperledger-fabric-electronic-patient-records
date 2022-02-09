const crypto = require('crypto');

class Image {

    constructor(imageName, ownerHosp, uploadedBy = '')
    {
        this.patientId = imageName;
        this.ownerHosp = ownerHosp
        return this;
    }
}
module.exports = Image