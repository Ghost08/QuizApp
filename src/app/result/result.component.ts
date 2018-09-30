import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  resultData: any = {
    quizName : "",
    paperTitle :"",
    totalQuestions:"",
    applicantData : {
      "userName":""
    },
    dateOfSubmmision:"",
    correctAnswerCount:0,
    wrongAnswerCount:0,
    testResult : ""

  };
  errorData: any = {};

  private _subscriptionId: any;
  private _quizId: any;
  private _paperId: any;
  private _subscribeData: any;
  private _answerData: any;

  constructor(
    private _quizService: QuizService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this._subscriptionId = params["subscriptionId"];
    });

    if (this._subscriptionId) {
      this._quizService.fetchSubscriptionDatabyId(this._subscriptionId)
        .subscribe(res => {
         // console.log(res["result"]);
          this._subscribeData = res["result"];

          this._quizId = this._subscribeData["quizId"]["_id"];
          this._paperId = this._subscribeData["paperId"]["_id"];

          this._quizService.fetchAnswerData(this._quizId, this._paperId)
            .subscribe(res => {
              this._answerData = res["result"];
              //console.log(this._answerData);

              this.ShowQuizPaperResult();
            }, err => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                  this._router.navigate(["/login"]);
                } else {
                  this.errorData.errorMsg = "Sorry !! An error occured..";
                }
              }
            });
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(["/login"]);
            } else {
              this.errorData.errorMsg = "Sorry !! An error occured..";
            }
          }

        })
    }
  }


  private ShowQuizPaperResult() {
    if (this._subscribeData && this._answerData) {
      let submittedAnswerData = this._subscribeData["answers"];
      this.resultData.quizName = this._subscribeData["quizId"]["quizName"];     
      this.resultData.paperTitle = this._subscribeData["paperId"]["paperTitle"];     
      this.resultData.totalQuestions = submittedAnswerData.length;
      this.resultData.applicantData = this._subscribeData["userId"];
      this.resultData.dateOfSubmmision = this._subscribeData["createdDate"];
      let correctCount = 0;
      let wrongCount = 0;
      for (let i = 0; i < submittedAnswerData.length; i++) {
        let submittedQuestionId = submittedAnswerData[i].questionId;
        let submittedAnswerId = submittedAnswerData[i].answerId;
        let correctAnswerData = this._answerData.find(f => f.questionId["_id"] === submittedQuestionId);
        console.log(correctAnswerData);

        if (correctAnswerData) {
          if (correctAnswerData.answerId === submittedAnswerId) {
            correctCount++;
          }
          else {
            wrongCount++;
          }
        }
      }
      this.resultData.correctAnswers = correctCount;
      this.resultData.wrongAnswers = wrongCount;
      this.resultData.testResult = correctCount===submittedAnswerData.length ? "Pass" : "Fail";
      
      //save result data
      let finalResult = {
          "subscriptionId":this._subscriptionId,
          "paperId":this._paperId,
          "quizId":this._quizId,
          "userId":this.resultData.applicantData["_id"],
          "totalQuestions":this.resultData.totalQuestions,
          "correctAnswers":this.resultData.correctAnswers,
          "wrongAnswers":this.resultData.wrongAnswers,
          "result":this.resultData.testResult,
          "active":true,
          "score":0
      }

      this._quizService.saveResultData(finalResult).subscribe(res=>{
        console.log(res["status"]);
      },err=>{
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          } else {
            this.errorData.errorMsg = "Sorry !! An error occured..";
          }
        }
      });
    }
  }

}
