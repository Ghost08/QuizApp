import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  questionList: any = [];
  questionData: any = {};
  answerData: any = {};
  answerList: any = [];
  errorData: any = {};
  paperData: any = {};
  quizData: any = {};

  private paperId: any;
  private quizId: any;
  questionCount: any;
  currentQuestion: any = 1;


  constructor(
    private _quizService: QuizService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this.quizId = params["quizId"];
      this.paperId = params["paperId"];
    });

    if (this.quizId && this.paperId) {

      this._quizService.fetchPaperData(this.quizId, this.paperId).subscribe(res => {
        this.paperData = res["result"];
        this.quizData = res["result"]["quizId"];
        this._quizService.fetchQuestionData(this.quizId, this.paperId).subscribe(res => {
          this.questionList = res["result"];
          console.log(this.questionList);
          this.setQuestion(this.currentQuestion);
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(["/login"]);
            }
          }
        });

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

  private setQuestion(seq) {
    if (this.questionList != null && this.questionList.length > 0) {
      this.questionCount = this.questionList.length;
      this.questionData = this.questionList[seq - 1];
      this.currentQuestion = seq;
    }
  }

  nextQuestion() {
    let seq = this.currentQuestion + 1;
    if (seq <= this.questionCount) {

      if (this.setAnswer()) {
        this.setQuestion(seq);
      }
    }
  }

  submitPaper() {
    if (this.setAnswer()) {
      console.log(this.answerList);
      let finalSubscriptionData: any = {};
      finalSubscriptionData.answers = this.answerList;
      finalSubscriptionData.active = true;
      finalSubscriptionData.quizId = this.quizId;
      finalSubscriptionData.paperId = this.paperId;

      this._quizService.saveSubscriptionData(finalSubscriptionData).subscribe(res => {

        let finalResponse = res["result"];
        console.log(finalResponse);
        let subscriptionId = finalResponse["subscriptionId"];

        this.errorData = {};
        this._router.navigate(["/result", subscriptionId]);

      }, err => {
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

  private setAnswer(): boolean {

    if (this.answerData.answerId) {
      this.answerData.questionId = this.questionData._id;
      if (this.answerList != null && this.answerList.length > 0) {
        let questionIndex;
        let answerExists = false;
        for (let i = 0; i < this.answerList.length; i++) {
          questionIndex = i;
          if (this.answerList[i].questionId === this.answerData.questionId) {
            answerExists = true;
            break;
          }
        }

        if (answerExists) {
          this.answerList.splice(questionIndex, 1);
        }
      }

      this.answerList.push(this.answerData);
      this.answerData = {};
      this.errorData = {};
      return true;
    }

    this._toastrService.warning("Choose your answer");    
    return false;
  }



}
