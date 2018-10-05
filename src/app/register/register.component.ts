import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserData: any = {};
  errorData: any = {};
  constructor(private _auth: AuthService,
              private _router: Router,
              private _toastrService: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  registerUser() {
    let isValidForm: boolean = true;

    if (this.registerUserData.firstName == "" || this.registerUserData.firstName == null) {      
      this._toastrService.warning("Provide First Name");
      isValidForm = false;
    } else if (this.registerUserData.email == "" || this.registerUserData.email == null) {
      this._toastrService.warning("Provide Email");
      isValidForm = false;
    } else if (this.registerUserData.userName == "" || this.registerUserData.userName == null) {
      this._toastrService.warning("Provide User Name");
      isValidForm = false;
    } else if (this.registerUserData.password == "" || this.registerUserData.password == null) {
      this._toastrService.warning("Provide password");
      isValidForm = false;
    }
    
    if (isValidForm) {
      this.spinner.show();
      this.errorData={};      
      this._auth.registerUser(this.registerUserData)
        .subscribe(
          res => {
            console.log(res);            
            localStorage.setItem("token", res.result.token);     
            localStorage.setItem("userName", res.result.userName);
            localStorage.setItem("role", res.result.role);   
            this.spinner.hide();    
            this._router.navigate(["/quiz"]);
            this._toastrService.success("Registration complete");
          },
          err => {
            this.spinner.hide();
            console.log(err);
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this._router.navigate(["/login"]);
              }
              else {
                this.errorData.errorMsg = "Sorry !! An error occured..";
              }
            }
          }
        );
    }
  }

}
