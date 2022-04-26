import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { DoctorViewRecord, transactionRecord } from './doctor';
import { DoctorService } from './doctor.service';

import { Chart } from 'node_modules/chart.js';



@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit, OnDestroy {
  public doctorId: any;
  public hospitalId: any;
  public doctorRecordObs?: Observable<DoctorViewRecord>;
  private sub?: Subscription;
  public isVCU: boolean;
  public parsedhospID: any;
  public transactionRecordDisplay: Array<transactionRecord> = [];
  //public all_images$?: Observable<Array<transferredImages>>;

//  public headerNames = [
//    new DisplayVal(viewTransferredAssets.prototype.imageName, 'Image Name'),
//    new DisplayVal(viewTransferredAssets.prototype.file, 'File'),
//    new DisplayVal(viewTransferredAssets.prototype.transferredBy, 'Transferred By'),
//    new DisplayVal(viewTransferredAssets.prototype.ownerHosp, 'ownerHosp')

//  ];

public transactionID: any;
private allSub = new Subscription();
  TransactionRecord: any[];


  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.doctorId = params.doctorId;
        this.hospitalId = params.hospitalId;
        this.refresh();
        this.isVCUMethod();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.doctorRecordObs = this.doctorService.getDoctorByHospitalId(this.authService.getHospitalId(), this.doctorId);
    this.allSub.add(
      this.doctorService.getTransaction().subscribe(x => {
        this.TransactionRecord = [];
        const data = x as Array<transactionRecord>;
        console.log(data);
        let count: number = 0;
        for(var i = 0; i <data.length; i++){
          let Transaction = Object.values(data)[i];
          console.log(Transaction);


          this.TransactionRecord.push(Transaction);
        }

        console.log(this.TransactionRecord);
      }

      
    ));
    
    console.log(this.transactionRecordDisplay);
    
    //console.log(this.transactionID);
    //this.all_images = this.doctorService.fetchAllTransferredImages(); 
    
    console.log(this.transactionRecordDisplay[0]);
    console.log(this.transactionRecordDisplay[1]);
    console.log(this.transactionRecordDisplay);

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

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }


}