export interface ImageRecord {
    imageName: string;
    ownerHosp: string;
    file: string;
    transferredBy: string;
  }
  export class ImageViewRecord {
    imageName = '';
    ownerHosp = '';
    file = '';
    transferredBy = '';
    constructor(readonly imageRecord: ImageRecord) {
      this.imageName= imageRecord.imageName;
      this.ownerHosp = imageRecord.ownerHosp;
      this.file = imageRecord.file;
      this.transferredBy = imageRecord.transferredBy;
    }
  }