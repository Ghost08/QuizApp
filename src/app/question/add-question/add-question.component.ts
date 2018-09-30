import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  questionList: any = [];
  questionData: any = {};
  optionList: any = [];
  optionData: any = {};
  errorData: any = {};
  paperData: any = { "quizId": {} };
  selectedQuestionData: any = {};
 
  
  modalOptions = {
    questionModal: {
      target: "",
      toggle: "",
      dismiss: ""
    },
    optionModal: {
      target: "",
      toggle: "",
      dismiss: ""
    }
  }

  private paperId: any;
  private quizId: any;

  constructor(
    private _quizService: QuizService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService) { }

  ngOnInit() {
    this.fetchQuestionData();
  }

  private fetchQuestionData() {

    this._route.params.subscribe(params => {
      this.quizId = params["quizId"];
      this.paperId = params["paperId"];
    });

    if (this.quizId && this.paperId) {
      this._quizService.fetchPaperData(this.quizId, this.paperId).subscribe(res => {
        this.paperData = res["result"];
        this._quizService.fetchQuestionData(this.quizId, this.paperId).subscribe(res => {
          this.questionList = res["result"];
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
  createQuestion() {
    console.log(this.questionData);
    let isValidForm: boolean = true;

    if (this.questionData.questionTitle == "" ||
      this.questionData.questionTitle == null) {
      this._toastrService.warning("Provide Title");
      isValidForm = false;
    }

    if (isValidForm) {
      this.saveQuestionData();
    }


  }

  selectQuestion(question) {
    if (question) {
      this.questionData = Object.assign({}, question);
    }
  }


  addOptionToQuestion() {
    let isValidForm: boolean = true;
    if (this.optionData) {
      if (this.optionData.optionTitle == null ||
        this.optionData.optionTitle == "") {
        this._toastrService.warning("Provide Title");
        isValidForm = false;
      }

      if (isValidForm) {
        this.optionData.active = true;
        if (this.questionData.options != null &&
          this.questionData.options.length > 0) {
          this.questionData.options.push(this.optionData);
        }
        else {
          this.questionData.options = [];
          this.questionData.options.push(this.optionData);
        }
        this.errorData = {};
        this.optionData = {};
        this._toastrService.success("Option added");
      }

    }
  }

  private saveQuestionData() {
    console.log("saveQuestionData");

    this.errorData = {};
    this.questionData.quizId = this.quizId;
    this.questionData.paperId = this.paperId;

    this._quizService.saveQuestionData(this.questionData)
      .subscribe(res => {
        this._toastrService.success("Details Saved");
        this.questionData = {};
        this.fetchQuestionData();
      }, err => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(["/login"]);
          }
        }

      })

  }

  createOption() {
    if (this.questionData.options != null &&
      this.questionData.options.length > 0) {
      this.saveQuestionData();
    }
    else {
      this._toastrService.warning("Add Options");
    }
  }

  removeOption(optionId) {
    if (optionId) {
      if (confirm("Are you sure ?")) {
        if (this.questionData.options != null &&
          this.questionData.options.length > 0) {
          for (let i = 0; i < this.questionData.options.length; i++) {
            if (this.questionData.options[i]["_id"] == optionId) {
              this.questionData.options.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }

  removeQuestion(questionId) {
    if (questionId) {
      if (confirm("Are you sure ?")) {
        this._quizService.deleteQuestion(questionId).subscribe(res => {
          this._toastrService.success("Question Deleted");
          this.fetchQuestionData();          
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
  }

}
