import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData: any = {};
  errorData: any = {};
  constructor(private _auth: AuthService, 
              private _router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  loginUser() {
    let isValidForm: boolean = true;

    if (this.loginUserData.userName == "" || this.loginUserData.userName == null) {
      this.errorData.errorMsg = "Provide User Name";
      isValidForm = false;
    } else if (this.loginUserData.password == "" || this.loginUserData.password == null) {
      this.errorData.errorMsg = "Provide password";
      isValidForm = false;
    }

    if (isValidForm) {
      this.spinner.show();
      this._auth.loginUser(this.loginUserData)
        .subscribe(
          res => {
            console.log(res);
            localStorage.setItem("token", res.result.token);
            localStorage.setItem("userName", res.result.userName);
            localStorage.setItem("role", res.result.role);
            this.spinner.hide();
            this._router.navigate(["/quiz"]);
          }, err => {
            console.log(err);
            this.spinner.hide();
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.errorData.errorMsg = "Authentication failed..";
              }
              else {
                this.errorData.errorMsg = "Sorry !! An error occured..";
              }
            }
          });
    }
  }
}
