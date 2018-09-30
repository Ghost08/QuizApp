import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {

  paperList : any = [];
  quizData : any = {};
  private quizId: any;

  constructor(private route: ActivatedRoute, private _quizService: QuizService, private _router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.quizId = params["quizId"];
    });

    if (this.quizId) {
      //get quiz details
      this._quizService.fetchQuizDataById(this.quizId).subscribe(res => {
        this.quizData = res["result"];
        //console.log(this.quizData);
        this.fetchPapers(this.quizId);
      }, err => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
        }
      });
    }
  }

  private fetchPapers(quizId) {
    this._quizService.fetchQuizPaperData(quizId).subscribe(res => {
      this.paperList = res["result"];
      console.log(this.paperList);
    }, err => {
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this._router.navigate(["/login"]);
        }
      }
    });
  }
}
