import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { SimpleTimer } from "ng2-simple-timer";
import { environment } from "../../environments/environment"
import { NgxSpinnerService } from 'ngx-spinner';

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

  timer: any = "";
  quizDuration: any = `${Math.floor(environment.quizDuration / 60)} mins`;
  private timerId: any = "";
  private quizTime: any = environment.quizDuration;//in seconds
  private timerCount: any = 0;

  constructor(
    private _quizService: QuizService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService,
    private _simpleTimer: SimpleTimer,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this.quizId = params["quizId"];
      this.paperId = params["paperId"];
    });

    if (this.quizId && this.paperId) {
      this.spinner.show();
      this._quizService.fetchPaperData(this.quizId, this.paperId).subscribe(res => {
        this.paperData = res["result"];
        this.quizData = res["result"]["quizId"];

        this._quizService.fetchQuestionData(this.quizId, this.paperId).subscribe(res => {

          let unSortedList = res["result"];
          this.questionList = this.shuffle(unSortedList);

          //console.log(this.questionList);
          this.setQuestion(this.currentQuestion);
          this.spinner.hide();

          //create timer
          this.startTimer();

        }, err => {
          this.spinner.hide();
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(["/login"]);
            }
          }
        });

      }, err => {
        this.spinner.hide();
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
        }
      });
    }
  }


  private startTimer() {
    this._simpleTimer.newTimer("quizAppTimer", 1);
    this.timerId = this._simpleTimer.subscribe("quizAppTimer", () => {
      this.timerCount++;
      let minutes = Math.floor(this.timerCount / 60);
      let seconds = this.timerCount - minutes * 60;
      this.timer = this.str_pad_left(minutes, '0', 2) + ':' + this.str_pad_left(seconds, '0', 2);

      if (this.timerCount >= this.quizTime) {
        this.stopTimer(true);
      }
    })
  }

  private stopTimer(istimeup) {
    this._simpleTimer.unsubscribe(this.timerId);
    this.timerId = undefined;
    this.timerCount = 0;
    if (istimeup)
      this._router.navigate(["/timeout", this.quizId, this.paperId]);
  }

  private str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
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
      
      let finalSubscriptionData: any = {};
      finalSubscriptionData.answers = this.answerList;
      finalSubscriptionData.active = true;
      finalSubscriptionData.quizId = this.quizId;
      finalSubscriptionData.paperId = this.paperId;

      this.stopTimer(false);
      this.spinner.show();
      this._quizService.saveSubscriptionData(finalSubscriptionData).subscribe(res => {
        let finalResponse = res["result"];        
        let subscriptionId = finalResponse["subscriptionId"];        
        this.errorData = {};
        this.spinner.hide();
        this._router.navigate(["/result", subscriptionId]);
      }, err => {
        console.log(err);
        this.spinner.hide();
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

  private shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }




}
