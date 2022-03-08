const crypto = require('crypto');

class Image {

    constructor(imageName, ownerHosp, file, transferredBy = '')
    {
        this.imageName = imageName;
        this.ownerHosp = ownerHosp;
        this.file = file;
        this.transferredBy = transferredBy;
        return this;
    }
}
module.exports = Image