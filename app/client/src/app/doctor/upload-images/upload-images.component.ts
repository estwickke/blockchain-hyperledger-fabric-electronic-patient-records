import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { DoctorService } from '../doctor.service';
import { AuthService } from '../../core/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageRecord, ImageViewRecord } from '../doctor';
import { DisplayVal } from '../../patient/patient';



class image {
  imageID!: string;
  imageName!: string;
  File!: string;
  ownerHosp!: string;
  transferredBy!: string;
};



@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit {

  public hospitalList = [
    {id: '1', name: 'Hospital 1'},
    {id: '2', name: 'Hospital 2'},
    {id: '3', name: 'Hospital 3'}
  ];

  ownerHospForm = new FormGroup({
    ownerHosp : new FormControl(),
  });

  public form: FormGroup;
  public imageName: any;
  public imageRecord: Array<ImageViewRecord> = [];
  public imageRecordDisplay: Array<ImageRecord> = [];
  public error: any = null;
  private allSub = new Subscription();
  public transferImageData: any;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  public imageString: any;

  stringImage: any;
  objectImage: any;
  
  ownerHosp: string = '';
  //imageID: string = '';

  previews: string[] = [];
  public imageRecords$?: Observable<Array<ImageViewRecord>>;


  imageInfos?: Observable<any>;
  private sub?: Subscription;
  

  public headerNames = [
    new DisplayVal(ImageViewRecord.prototype.imageName, 'Image Name'),
    new DisplayVal(ImageViewRecord.prototype.ownerHosp, 'Owner Hosp'),
    new DisplayVal(ImageViewRecord.prototype.file, 'File'),
    new DisplayVal(ImageViewRecord.prototype.transferredBy, 'Transferred By')
  ];

    

  constructor(private uploadService: FileUploadService,
              private readonly authService: AuthService,
              private readonly doctorService: DoctorService,
              private readonly fb: FormBuilder,) { 
                {
                  this.form = this.fb.group({
                    imageName: ['', Validators.required],
                    hospitalId: ['', Validators.required],
                    file: ['', Validators.required],
                  });
              }
            }



  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.imageString = e.target.result;
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  transferFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.transfer(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          //was originally a real error message 
          const msg = 'Uploaded the file successfully: '  + file.name;
          this.message.push(msg);
        }});
    }
  }

  public queryImages(): void{
    const formData: FormData = new FormData();
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    this.form = this.fb.group({
      transferredBy: [transferredBy, Validators.required],
    });
    
    console.log(this.ownerHosp + '236363636636');
    //console.log(this.imageID + '237373737');
    formData.append('transferredBy', transferredBy);
    var imageName = '';
    console.log(transferredBy + '167676776766');
    console.log(this.form.value + '16868686868686');
    //ImageRecord.imageName = "name";
    if (transferredBy === 'hosp1'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp1().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          //while (Object.values(data)[count] != null){
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         // let MyImageName = Object.values(data)[1];
         // let MyImageOwner = Object.values(data)[2];
         // let MyImageTransferredBy = Object.values(data)[3];
          //let testIndex = Object.values(data)[4];
  
         // this.imageRecord.push(MyImageName);
            this.imageRecord.push(MyImageBlob);
          }
         // this.imageRecord.push(MyImageOwner);
         // this.imageRecord.push(MyImageTransferredBy);
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          console.log(this.objectImage);
          //console.log(this.objectImage[0].image.imageName);
          //console.log(this.stringImage + '1767676767676767676');
          let imageLength = this.objectImage.length;
          console.log(imageLength);
          this.imageRecordDisplay = [];
          for(var i = 0; i < imageLength; i++){
            let privateImage: ImageRecord = {
              imageName: this.objectImage[i].image.imageName,
              file: this.objectImage[i].image.file,
              transferredBy: this.objectImage[i].image.transferredBy,
              ownerHosp: this.objectImage[i].image.ownerHosp,
              }
              while (this.objectImage[i].image.imageName =! null){
                this.imageRecordDisplay.push(privateImage);
                console.log(privateImage);
                break;
              }
    
          }
          console.log(this.imageRecordDisplay);
        
        })
      );
    }
    else if (transferredBy === 'hosp2'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp2().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          //while (Object.values(data)[count] != null){
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         // let MyImageName = Object.values(data)[1];
         // let MyImageOwner = Object.values(data)[2];
         // let MyImageTransferredBy = Object.values(data)[3];
          //let testIndex = Object.values(data)[4];
  
         // this.imageRecord.push(MyImageName);
            this.imageRecord.push(MyImageBlob);
          }
         // this.imageRecord.push(MyImageOwner);
         // this.imageRecord.push(MyImageTransferredBy);
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          console.log(this.objectImage);
          //console.log(this.objectImage[0].image.imageName);
          //console.log(this.stringImage + '1767676767676767676');
          let imageLength = this.objectImage.length;
          console.log(imageLength);
          this.imageRecordDisplay = [];
          for(var i = 0; i < imageLength; i++){
            let privateImage: ImageRecord = {
              imageName: this.objectImage[i].image.imageName,
              file: this.objectImage[i].image.file,
              transferredBy: this.objectImage[i].image.transferredBy,
              ownerHosp: this.objectImage[i].image.ownerHosp,
              }
              while (this.objectImage[i].image.imageName =! null){
                this.imageRecordDisplay.push(privateImage);
                console.log(privateImage);
                break;
              }
    
          }
          console.log(this.imageRecordDisplay);
        
        })
      );
    }
    else if (transferredBy === 'hosp3'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp3().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          //while (Object.values(data)[count] != null){
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         // let MyImageName = Object.values(data)[1];
         // let MyImageOwner = Object.values(data)[2];
         // let MyImageTransferredBy = Object.values(data)[3];
          //let testIndex = Object.values(data)[4];
  
         // this.imageRecord.push(MyImageName);
            this.imageRecord.push(MyImageBlob);
          }
         // this.imageRecord.push(MyImageOwner);
         // this.imageRecord.push(MyImageTransferredBy);
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          console.log(this.objectImage);
          //console.log(this.objectImage[0].image.imageName);
          //console.log(this.stringImage + '1767676767676767676');
          let imageLength = this.objectImage.length;
          console.log(imageLength);
          this.imageRecordDisplay = [];
          for(var i = 0; i < imageLength; i++){
            let privateImage: ImageRecord = {
              imageName: this.objectImage[i].image.imageName,
              file: this.objectImage[i].image.file,
              transferredBy: this.objectImage[i].image.transferredBy,
              ownerHosp: this.objectImage[i].image.ownerHosp,
              }
              while (this.objectImage[i].image.imageName =! null){
                this.imageRecordDisplay.push(privateImage);
                console.log(privateImage);
                break;
              }
    
          }
          console.log(this.imageRecordDisplay);
        
        })
      );
    }
    
    }
  
    public getOwnerHosp(event: any) {
      this.ownerHosp = event.target.value;
      console.log(this.ownerHosp);
     }

  transfer(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    console.log(file);
    //const files = file;
    const formData: FormData = new FormData();

    var min = 0;
    var max = 100;
    var randomGenerator = Math.floor(Math.random() * (max - min+1)) + min;
    const keyCounter = 'ID-' + randomGenerator;
    //console.log(keyCounter); //THERE

    const hospitalId = this.ownerHosp + '-' + keyCounter; //who we're transferring to
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    //const imageIDName = this.imageID;
    const reader = new FileReader();
    


    this.form = this.fb.group({
      imageName: [file.name, Validators.required],
      ownerHosp: [hospitalId, Validators.required], //target hospital (transfer to)
      file: [this.imageString, Validators.required],
      transferredBy: [transferredBy, Validators.required],
    });
    
    console.log(this.ownerHosp + '236363636636');
    //console.log(this.imageID + '237373737');

    formData.append('file', this.imageString);
    formData.append('imageName', file.name);
    formData.append('ownerHosp', hospitalId);
    formData.append('transferredBy', transferredBy);
    
    //console.log(formData.get('file'));
    //console.log(formData.get('imageName'));
    //console.log(formData.get('ownerHosp'));
    //console.log(formData.get('transferredBy'));
    //console.log(file.name);
    //console.log(hospitalId);
    this.allSub.add(
      this.doctorService.transfer(this.form.value).subscribe(x => this.transferImageData = x)
    );
    
  }

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
    //this.imageRecords$ = this.doctorService.fetchAllTransferredImages();
    //console.log(this.imageRecords$ + '1979797979979799');
  }

  

}

