import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../quiz.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit {

  quizData: any = {};
  errorData: any = {};
  quizList: any = [];

  constructor(private _quizSevice: QuizService,
     private _router: Router,
     private spinner: NgxSpinnerService) { }

  ngOnInit() {
    
    this.fetchQuizList();
  }

  private fetchQuizList() {
    this.spinner.show();
    this._quizSevice.fetchQuizData()
      .subscribe(res => {
        //console.log(res["result"]);
        this.quizList = res["result"];
        this.spinner.hide();
      }, err => {
        console.log(err);
        this.spinner.hide();
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
        }
      });
  }

  setQuizData(quiz){
    this.errorData = {};
    this.quizData = Object.assign({},quiz);
    console.log(this.quizData);
  }

  clearData(){
    this.errorData = {};
    this.quizData = {};    
  }
  createQuiz() {
    //console.log(this.quizData);
    let isValidForm: boolean = true;

    if (this.quizData.quizName == "" || this.quizData.quizName == null) {
      this.errorData.errorMsg = "Provide Quiz Name";
      isValidForm = false;
    }
    else if (this.quizData.quizType == "" || this.quizData.quizType == null) {
      this.errorData.errorMsg = "Provide Quiz Type";
      isValidForm = false;

    } else if (this.quizData.quizDesc == "" || this.quizData.quizDesc == null) {
      this.errorData.errorMsg = "Provide Quiz Description";
      isValidForm = false;
    }

    if (isValidForm) {
      this.spinner.show();
      this.errorData = {};
      this.quizData.active = true;
      this._quizSevice.saveQuizData(this.quizData)
        .subscribe(res => {
          let response = res["result"];
          let quizId = response["_id"];
          //console.log(quizId);
          this.quizData = {};        
          this.spinner.hide();
          this.fetchQuizList();
          
          //this._router.navigate(["/quiz"]);
        }, err => {
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
        });
    }

  }

}
