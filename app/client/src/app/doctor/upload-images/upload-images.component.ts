import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { DoctorService } from '../doctor.service';
import { AuthService } from '../../core/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageRecord, ImageViewRecord} from '../doctor';

import { DisplayVal } from '../../patient/patient';
import { ActivatedRoute, Params } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';





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

  public isVCU: boolean;
  public parsedhospID: any;
  public form: FormGroup;
  public popUpForm: FormGroup;
  public imageName: any;
  public imageRecord: Array<ImageViewRecord> = [];
  public imageRecordDisplay: Array<ImageRecord> = [];
  public error: any = null;
  private allSub = new Subscription();
  public transferImageData: any;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  messageTransfer: string[] = [];
  public imageString: any;
  public imageBlobString: any;
  public imageRecordDisplayTemp: Array<ImageRecord> = [];
  currentDate = new Date();
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert;

  stringImage: any;
  objectImage: any;
  
  ownerHosp: string = '';
  //imageID: string = '';
  public doctorId: any;

  previewsTransfer: string[] = [];
  public imageURL: string = '';
  public imageBlob?: Blob;
  public doctorIdTwo: any;



  closeResult = '';

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
              private readonly fb: FormBuilder,
              private readonly route: ActivatedRoute,
              private modalService: NgbModal) { 
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

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.currentDate = new Date(file.lastModified);
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    console.log(transferredBy + '15959595995');
    if (file) {
      this.uploadService.upload(file, transferredBy).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles(transferredBy);
            console.log(this.imageInfos);
          }
          console.log(this.imageInfos);
          //this.currentDate = new Date(file.lastModified);
          console.log(this.currentDate);

        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          //was originally a real error message 
          const msg = 'Uploaded the file successfully: '  + file.name;
          this.message.push(msg);
        }});

    }
    console.log(file);
  }

  public queryImages(): void{
    const formData: FormData = new FormData();
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    this.form = this.fb.group({
      transferredBy: [transferredBy, Validators.required],
    });
    
    //console.log(this.ownerHosp + '236363636636');
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

  transfer(file: File, imageBlob: any): void {
   
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
    
    //this.imageBlobString = imageBlob.toString();
    console.log(imageBlob);

    this.form = this.fb.group({
      imageName: [file.name, Validators.required],
      ownerHosp: [hospitalId, Validators.required], //target hospital (transfer to)
      file: [imageBlob, Validators.required],
      transferredBy: [transferredBy, Validators.required],
    });
    
    console.log(this.ownerHosp + '236363636636');
    //console.log(this.imageID + '237373737');

    formData.append('file', imageBlob);
    formData.append('imageName', file.name);
    formData.append('ownerHosp', hospitalId);
    formData.append('transferredBy', transferredBy);
    
    
    console.log(formData.get('file'));
    console.log(formData.get('imageName'));
    console.log(formData.get('ownerHosp'));
    console.log(formData.get('transferredBy'));
    //console.log(file.name);
    //console.log(hospitalId);
    this.allSub.add(
      this.doctorService.transfer(this.form.value).subscribe(x => this.transferImageData = x)
    );

    this.messageTransfer = [];
    const msg = 'Transferred successfully.';
    this.messageTransfer.push(msg);

  }
  public isVCUMethod(): void {
    console.log(this.doctorId);
    var doctorID = this.doctorId;
    this.parsedhospID = doctorID.substring(0,5);
    console.log(this.parsedhospID);
    if(this.parsedhospID == "HOSP1"){
      //console.log(this.hospitalId);
      this.isVCU = true;
    }
    else{
      this.isVCU = false;
    }
  }

  ngOnInit(): void {
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    this.imageInfos = this.uploadService.getFiles(transferredBy);
    this.queryImages();
    
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.doctorId = params.doctorId;
        this.isVCUMethod();
      });
  }

  open(content: any, image: any) {
    this.imageRecordDisplayTemp = [];
    console.log(image);
    this.imageRecordDisplayTemp.push(image);
    console.log(this.imageRecordDisplayTemp);

    this.modalService.open(content, { size: 'xl' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
    });

    
   

  
  }

  openTwo(contentTwo: any) {


    this.modalService.open(contentTwo, { size: 'xl' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
    });

    
   

  
  }

  private getDismissReason(reason: any): string {
    
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }

 //update with call to transfer and change of paramters**
public getLocalFiles(image: any) {
  console.log(image);
  this.messageTransfer = [];
  this.imageURL = image.url;
  var imageNameBeforeSplit = this.imageURL;
  console.log(this.imageURL);
  
  var imageNameAfter = imageNameBeforeSplit.substring(28, imageNameBeforeSplit.length);
  console.log(imageNameAfter);
 // http://localhost:3001/files/1649698621763-VCUImageTWO.jfif

  console.log(this.imageURL);
  (async () => {
    const response = await fetch(this.imageURL);
    const imageBlob = await response.blob();
    var file = new File([imageBlob], imageNameAfter);
    //this.transfer(file); //call to function IMPORTANT
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    //this.selectedFiles = file;
    reader.onloadend = () => {
      const base64data = reader.result;
      console.log(base64data); //whole blob
      //this.transfer(base64data);
      this.transfer(file, base64data);
    }
  })()
  console.log(this.getLocalFiles);
}
}

