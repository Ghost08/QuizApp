import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
 
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quizList = [];

  constructor(private _quizservice: QuizService,
     private _router: Router,
     private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this._quizservice.fetchQuizData()
      .subscribe(res => {
        console.log(res["result"]);
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
      })
  }
}
