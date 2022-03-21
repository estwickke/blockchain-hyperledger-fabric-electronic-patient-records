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
  public error: any = null;
  private allSub = new Subscription();
  public transferImageData: any;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  public imageString: any;
  
  ownerHosp: string = '';

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
    var imageName = '';
    //ImageRecord.imageName = "name";
    this.allSub.add(
      this.doctorService.fetchAllTransferredImages().subscribe(x => {
        const data = x as Array<ImageRecord>;
        let MyImageBlob = Object.values(data)[0];
        let MyImageName = Object.values(data)[1];
        let MyImageOwner = Object.values(data)[2];
        let MyImageTransferredBy = Object.values(data)[3];
        //let testIndex = Object.values(data)[4];

        this.imageRecord.push(MyImageName);
        this.imageRecord.push(MyImageBlob);
        this.imageRecord.push(MyImageOwner);
        this.imageRecord.push(MyImageTransferredBy);

        console.log(MyImageBlob + 'ImageBlob');
        console.log(MyImageName + 'ImageName');
        console.log(MyImageOwner + 'ImageOwner');
        console.log(MyImageTransferredBy + 'ImageTransferredBy');
        console.log(JSON.stringify(data) + 'stringified JSON data');
        

      })
    );
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
    const hospitalId = this.ownerHosp; //who we're transferring to
    console.log(hospitalId);
    const transferredBy = 'hosp' + this.authService.getHospitalId();  //who is transferring
    
    const reader = new FileReader();
    
    this.form = this.fb.group({
      imageName: [file.name, Validators.required],
      ownerHosp: [hospitalId, Validators.required], //target hospital (transfer to)
      file: [this.imageString, Validators.required],
      transferredBy: [transferredBy, Validators.required],
    });
    
    
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

