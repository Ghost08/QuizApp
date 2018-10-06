import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.css']
})
export class AddAnswerComponent implements OnInit {

  private paperId: any;
  private quizId: any;

  questionList: any = [];
  answerList: any = [];
  optionList: any = [];

  errorData: any = {};
  answerData: any = {};
  paperData: any = { "quizId": {} };
  selectedQuestion: any = "-1";
  answerId: any;

  constructor(
    private _quizService: QuizService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this.quizId = params["quizId"];
      this.paperId = params["paperId"];
    });

    if (this.quizId && this.paperId) {
     
      this._quizService.fetchPaperData(this.quizId, this.paperId).subscribe(res => {
        this.paperData = res["result"];
        this.fetchQuestionAndAnswerData();
        
      }, err => {
        
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
          else {
            this._toastrService.error("An Error Occured")
          }
        }
      });
    }
  }
  redirectToQuestion(){
    this._router.navigate(["/master/question",this.quizId,this.paperId]);
  }

  private fetchQuestionAndAnswerData(){
    this.spinner.show();
    this._quizService.fetchQuestionData(this.quizId, this.paperId).subscribe(res => {
      this.questionList = res["result"];
      this._quizService.fetchAnswerData(this.quizId, this.paperId).subscribe(res => {
        this.answerList = res["result"];
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          } else {
            this._toastrService.error("An Error Occured")
          }
        }
      });
    }, err => {
      this.spinner.hide();
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this._router.navigate(["/login"]);
        } else {
          this._toastrService.error("An Error Occured")
        }
      }
    });

  }

  onChangeObj(newObj) {
    console.log(newObj);
    this.selectedQuestion = newObj;
    if (newObj != "-1") {
      this.optionList = this.questionList.find(x => x._id == this.selectedQuestion).options;
      console.log(this, this.optionList);
      if (this.answerList != null && this.answerList.length > 0) {
        let answer = this.answerList.find(x => x.questionId._id == this.selectedQuestion);
        if (answer) {
          this.answerId = answer.answerId;
        }
      }

    }
    else {
      this.optionList = [];
      this.answerData = {};
      this.answerId = "";
    }
  }

  saveAnswerData() {

    if (this.answerId != null && this.answerId != "") {
      this.answerData = {};
      this.answerData.answerId = this.answerId;
      this.answerData.quizId = this.quizId;
      this.answerData.paperId = this.paperId;
      this.answerData.questionId = this.selectedQuestion;
      this.answerData.active = true;
      //console.log(this.answerData);
      this.spinner.show();
      this._quizService.saveAnswerData(this.answerData).subscribe(res => {
        this._toastrService.success("Details Saved");
        this.spinner.hide();
        this.fetchQuestionAndAnswerData();
        this.optionList = [];
        this.answerData = {};
        this.answerId = "";
        this.selectedQuestion ="-1";
      }, err => {
        this.spinner.hide();
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
          else {
            this._toastrService.error("An Error Occured")
          }
        }
      })

    } else {
      this.answerData = {};
      this.answerId = "";
      this._toastrService.warning("Select Answer");
    }


  }

}
