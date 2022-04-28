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

        let count: number = 0;
        for (var i = 0; i < data.length; i++) {
          let Transaction = Object.values(data)[i];



          this.TransactionRecord.push(Transaction);
        }

      }

      ));

  }

  public isVCUMethod(): void {

    var doctorID = this.doctorId;
    this.parsedhospID = doctorID.substring(0, 5);

    if (this.parsedhospID == "HOSP1") {

      this.isVCU = true;
    }
    else {
      this.isVCU = false;
    }
  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }


}