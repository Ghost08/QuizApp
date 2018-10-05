import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  resultList: any = [];
  passCount: any = 0;
  failCount: any = 0;
  totalCount: any = 0;

  constructor(private _quizservice: QuizService, 
              private _router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();  
    this._quizservice.fetchResultData().subscribe(res => {
      this.resultList = res["result"];
      this.spinner.hide();
      if (this.resultList != null && this.resultList.length > 0) {
        this.totalCount = this.resultList.length;        
        let pCount = this.resultList.filter(f => f.result == "Pass").length;
        let fCount = this.resultList.filter(f => f.result == "Fail").length;
        this.passCount = pCount!=undefined && pCount!=null ? pCount : 0;
        this.failCount = fCount!=undefined && fCount!=null ? fCount : 0;
      }
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
}
