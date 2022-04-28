import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { DoctorService } from '../doctor.service';
import { AuthService } from '../../core/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageRecord, ImageViewRecord, LedgerRecord, LedgerViewRecord} from '../doctor';

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

class ledger {
  date!: string;
  ownerHosp!: string;
  action!: string;
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

  public ledgerHistory = {};
  public key = '';
  public isVCU: boolean;
  public parsedhospID: any;
  public form: FormGroup;
  public transferForm: FormGroup;
  public popUpForm: FormGroup;
  public imageName: any;
  public imageRecord: Array<ImageViewRecord> = [];
  public imageRecordDisplay: Array<ImageRecord> = [];
  public LedgerRecordDisplay: Array<LedgerRecord> = [];
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
  
  public doctorId: any;

  previewsTransfer: string[] = [];
  public imageURL: string = '';
  public imageBlob?: Blob;
  public doctorIdTwo: any;



  closeResult = '';

  previews: string[] = [];
  public imageRecords$?: Observable<Array<ImageViewRecord>>;


  imageInfos?: Observable<any>;
  transferLedger?: Observable<any>;
  transferLedgerInfos?: Observable<any>;
  private sub?: Subscription;
  

  public headerNames = [
    new DisplayVal(ImageViewRecord.prototype.imageName, 'Image Name'),
    new DisplayVal(ImageViewRecord.prototype.ownerHosp, 'Owner Hosp'),
    new DisplayVal(ImageViewRecord.prototype.file, 'File'),
    new DisplayVal(ImageViewRecord.prototype.transferredBy, 'Transferred By')
  ];
  transferLedgerData: any;
  transferLedgerTemp: any;
  transferLedgerImage: any;
  LedgerRecord: any[];
  stringLedger: string;
  objectLedger: any;
  transaction: any;

    

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
    this.currentDate = new Date();
    const transferredBy = 'hosp' + this.authService.getHospitalId();  
    

    if (transferredBy == 'hosp1'){
    if (file) {
      this.uploadService.uploadOne(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFilesOne();
            
            
            
          }
          
          
          
          
          

        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          
          const msg = 'Uploaded the file successfully: '  + file.name;
          this.message.push(msg);
        }});

    }
  }
  else if (transferredBy == 'hosp2'){
    if (file) {
      this.uploadService.uploadTwo(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFilesTwo();
            
          }
          
          
          

        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          
          const msg = 'Uploaded the file successfully: '  + file.name;
          this.message.push(msg);
        }});

    }
  }
  if (transferredBy == 'hosp3'){
    if (file) {
      this.uploadService.uploadThree(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFilesThree();
            
          }
          
          
          

        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          
          const msg = 'Uploaded the file successfully: '  + file.name;
          this.message.push(msg);
        }});

    }
  }
    
    this.transferForm = this.fb.group({
              imageName: [file.name, Validators.required],
              ownerHosp: [this.ownerHosp, Validators.required], 
              currentDate: [this.currentDate, Validators.required],
            });

            this.allSub.add(
              this.doctorService.transaction(this.transferForm.value).subscribe(x => this.transaction = x)
            );
  }

  public queryImages(): void{
    const formData: FormData = new FormData();
    const transferredBy = 'hosp' + this.authService.getHospitalId();  
    this.form = this.fb.group({
      transferredBy: [transferredBy, Validators.required],
    });
    
    
    
    formData.append('transferredBy', transferredBy);
    var imageName = '';
    
    
    
    if (transferredBy === 'hosp1'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp1().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         
         
         
          
  
         
            this.imageRecord.push(MyImageBlob);
          }
         
         
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          
          
          
          let imageLength = this.objectImage.length;
          
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
                
                break;
              }
    
          }
          
        
        })
      );
    }
    else if (transferredBy === 'hosp2'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp2().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         
         
         
          
  
         
            this.imageRecord.push(MyImageBlob);
          }
         
         
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          
          
          
          let imageLength = this.objectImage.length;
          
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
                
                break;
              }
    
          }
          
        
        })
      );
    }
    else if (transferredBy === 'hosp3'){
      this.allSub.add(
        this.doctorService.fetchAllTransferredImagesHosp3().subscribe(x => {
          this.imageRecord = [];
          const data = x as Array<ImageRecord>;
          let count: number = 0;
          
          for(var i = 0; i <data.length; i++){
            let MyImageBlob = Object.values(data)[i];
            
         
         
         
          
  
         
            this.imageRecord.push(MyImageBlob);
          }
         
         
  
      
          this.stringImage = JSON.stringify(this.imageRecord);
          this.objectImage = JSON.parse(this.stringImage);
          
          
          
          let imageLength = this.objectImage.length;
          
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
                
                break;
              }
    
          }
          
          
        
        })
      );
    }
    
    }
  
    public getOwnerHosp(event: any) {
      this.ownerHosp = event.target.value;
      
     }

  transfer(file: File, imageBlob: any): void {
   
    
    
    const formData: FormData = new FormData();
    const transferFormData: FormData = new FormData();
    this.currentDate = new Date();

    var min = 0;
    var max = 100;
    var randomGenerator = Math.floor(Math.random() * (max - min+1)) + min;
    const keyCounter = 'ID-' + randomGenerator;
    

    const hospitalId = this.ownerHosp + '-' + keyCounter; 
    const transferredBy = 'hosp' + this.authService.getHospitalId();  
    
    const reader = new FileReader();

    this.transferForm = this.fb.group({
      imageName: [file.name, Validators.required],
      ownerHosp: [this.ownerHosp, Validators.required], 
      currentDate: [this.currentDate, Validators.required],
    });

    
    
    
    

    this.form = this.fb.group({
      imageName: [file.name, Validators.required],
      ownerHosp: [hospitalId, Validators.required], 
      file: [imageBlob, Validators.required],
      transferredBy: [transferredBy, Validators.required],
    });
    
    transferFormData.append('name', file.name);
    transferFormData.append('ownerHosp', this.ownerHosp);
    transferFormData.append('date', this.currentDate.toDateString());

    
    

    
    

    formData.append('file', imageBlob);
    formData.append('imageName', file.name);
    formData.append('ownerHosp', hospitalId);
    formData.append('transferredBy', transferredBy);
    
    
    
    
    
    
    
    
    this.allSub.add(
      this.doctorService.transfer(this.form.value).subscribe(x => this.transferImageData = x)
    );

    this.allSub.add(
      this.uploadService.transferLedger(this.transferForm.value).subscribe(x => this.transferLedgerData = x)
    );

    this.allSub.add(
      this.doctorService.transaction(this.transferForm.value).subscribe(x => this.transaction = x)
    );
    
    this.messageTransfer = [];
    const msg = 'Transferred successfully.';
    this.messageTransfer.push(msg);

  }

  public isVCUMethod(): void {
    
    var doctorID = this.doctorId;
    this.parsedhospID = doctorID.substring(0,5);
    
    if(this.parsedhospID == "HOSP1"){
      
      this.isVCU = true;
    }
    else{
      this.isVCU = false;
    }
  }

  ngOnInit(): void {
    const transferredBy = 'hosp' + this.authService.getHospitalId();  
    if (transferredBy == 'hosp1'){
    this.imageInfos = this.uploadService.getFilesOne();
    }
    else if (transferredBy == 'hosp2'){
    this.imageInfos = this.uploadService.getFilesTwo();
    }
    else if (transferredBy == 'hosp3'){
    this.imageInfos = this.uploadService.getFilesThree();
    }
    
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
    
    this.imageRecordDisplayTemp.push(image);
    
    

    this.transferLedgerImage = this.fb.group({
      imageName: [image.imageName, Validators.required]
    });

    this.allSub.add(
      this.uploadService.postTransferLedger(this.transferLedgerImage.value).subscribe(x => this.transferLedgerTemp = x)
    );
    this.allSub.add(
      this.uploadService.getTransferLedger().subscribe(x => {
        this.LedgerRecord = [];
        const data = x as Array<LedgerRecord>;
        
        let count: number = 0;
        for(var i = 0; i <data.length; i++){
          let LedgerBlob = Object.values(data)[i];
          


          this.LedgerRecord.push(LedgerBlob);
        }

        
      }

      
    ));
      var tempString = 'temp';
    this.transferForm = this.fb.group({
      imageName: [tempString, Validators.required],
      ownerHosp: [this.ownerHosp, Validators.required], 
      currentDate: [this.currentDate, Validators.required],
    });

    this.allSub.add(
      this.doctorService.transaction(this.transferForm.value).subscribe(x => this.transaction = x)
    );

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

 
public getLocalFiles(image: any) {
  
  this.messageTransfer = [];
  this.imageURL = image.url;
  var imageNameBeforeSplit = this.imageURL;
  
  
  var imageNameAfter = imageNameBeforeSplit.substring(33, imageNameBeforeSplit.length);
  
 

  
  (async () => {
    const response = await fetch(this.imageURL);
    const imageBlob = await response.blob();
    var file = new File([imageBlob], imageNameAfter);
    
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    
    reader.onloadend = () => {
      const base64data = reader.result;
      
      
      this.transfer(file, base64data);
    }
  })()
  
}

public addLedgerHistory(ledgerImageName: any, ledgerOwnerHosp: any, date: any, action: any){
    
    
    

    this.key = ledgerImageName;
    this.ledgerHistory[this.key] = [ledgerOwnerHosp, date, action];
    
  }
  
}

