import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Router } from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  resultList: any = [];

  constructor(private _quizservice: QuizService, private _router: Router) { }

  ngOnInit() {

    this._quizservice.fetchResultData().subscribe(res => {
      this.resultList = res["result"];
      console.log(this.resultList);

    }, err => {
      console.log(err);

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this._router.navigate(["/login"]);
        }
      }


    })

  }

}
