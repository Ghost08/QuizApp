import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
import {Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _registerUrl = "/api/register";
  private _loginUrl = "/api/login";

  constructor(private http: HttpClient, private _router : Router) { }

  registerUser(user) {
    return this.http.post<any>(environment.quizapiurl + this._registerUrl, user);
  }

  loginUser(user){
    return this.http.post<any>(environment.quizapiurl + this._loginUrl, user);
  }

  loggedIn(){
    return !!localStorage.getItem("token");
  }

  getToken(){    
    return localStorage.getItem("token");
  } 

  getUserName(){
    return localStorage.getItem("userName");
  }

  getRole(){
    return localStorage.getItem("role");
  }

  isValidUser(){
    if(this.getRole() ==="admin"){
      return true;
    }
    return false;
  }

  logoutUser(){
    localStorage.removeItem("token");
    localStorage.removeItem("userName");  
    localStorage.removeItem("role");    

    this._router.navigate(["/login"]);
  }
}
