import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { DoctorViewRecord } from './doctor';
import { DoctorService } from './doctor.service';


@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit, OnDestroy {
  public doctorId: any;
  public doctorRecordObs?: Observable<DoctorViewRecord>;
  private sub?: Subscription;
  //public all_images$?: Observable<Array<transferredImages>>;

//  public headerNames = [
//    new DisplayVal(viewTransferredAssets.prototype.imageName, 'Image Name'),
//    new DisplayVal(viewTransferredAssets.prototype.file, 'File'),
//    new DisplayVal(viewTransferredAssets.prototype.transferredBy, 'Transferred By'),
//    new DisplayVal(viewTransferredAssets.prototype.ownerHosp, 'ownerHosp')

//  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.doctorId = params.doctorId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.doctorRecordObs = this.doctorService.getDoctorByHospitalId(this.authService.getHospitalId(), this.doctorId);
    //this.all_images = this.doctorService.fetchAllTransferredImages(); 

  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }

}