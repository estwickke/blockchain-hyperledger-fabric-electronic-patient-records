import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../core/auth/auth.service';
import { HospitalUser, User } from '../User';
import { BrowserStorageFields, RoleEnum } from '../utils';

import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private PWD_CHANGE = 'CHANGE_TMP_PASSWORD';
  public createNewPwd = false;
  public showHospList = true;
  public role = '';
  public hospitalId = 0;
  public username = '';
  public pwd = '';
  public newPwd = '';
  public error = { message: '' };

  constructor(private authService: AuthService,
              private router: Router,
              private readonly modal: NgbModal,
              private socialAuthService: SocialAuthService,
              private formBuilder: FormBuilder
  ) { }

  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin!: boolean;

  // tslint:disable-next-line:typedef
   ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);
      this.username = (this.socialUser.name);
      //return this.username;
    });
   }

  loginWithGoogle(): void { 
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() =>
      this.authService.loginGoogleUser(new HospitalUser(this.role = 'doctor', this.hospitalId = 1, this.username, this.pwd = 'password'))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          ));
  }
  

   loginWithGoogle2(): void {
     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
   }

  logOut(): void {
    this.socialAuthService.signOut();
  }

  public resetFields(): void {
    this.role = '';
    this.hospitalId = 0;
    this.username = '';
    this.pwd = '';
    this.newPwd = '';
    this.createNewPwd = false;
    this.error.message = '';
  }

  public roleChanged(): void {
    this.showHospList = this.role !== RoleEnum.PATIENT;
  }

  public loginUser(): void {
    switch (this.role) {
      case RoleEnum.ADMIN:
        this.authService.loginAdminUser(new HospitalUser(this.role, this.hospitalId, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
      case RoleEnum.DOCTOR:
        this.authService.loginDoctorUser(new HospitalUser(this.role, this.hospitalId, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
      case RoleEnum.PATIENT:
        this.authService.loginPatientUser(new User(this.role, this.username, this.pwd, this.newPwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
    }
  }

  public loginPatient(patientPassword: TemplateRef<any>): void {
    this.modal.open(patientPassword).result.then(() => {
      this.loginUser();
    });
  }

  private afterSuccessfulLogin(res: any): void {
    if (res.success && res.success === this.PWD_CHANGE) {
      this.createNewPwd = true;

      return;
    } else if (!res.accessToken) {
      this.error.message = 'Token is missing.';

      return;
    }

    const role = this.role;
    const userId = this.username;
    const hospitalId = this.hospitalId;
    this.authService.setHeaders(res, role, hospitalId, userId);

    this.resetFields();

    this.router.navigate([ '/', role, userId]);
  }
}
