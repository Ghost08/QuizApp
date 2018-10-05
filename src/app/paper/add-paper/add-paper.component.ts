import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../quiz.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { Router } from '@angular/router'
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-paper',
  templateUrl: './add-paper.component.html',
  styleUrls: ['./add-paper.component.css']
})
export class AddPaperComponent implements OnInit {

  paperData: any = {};  
  errorData: any = {};
  quizList: any = [];
  paperList: any = [];
  selectedQuiz: any = "-1";

  constructor(private _quizSevice: QuizService,
              private _router: Router,
              private _toastrService: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
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


  createPaper() {
    //console.log(this.paperData);
    let isValidForm: boolean = true;
    if (this.paperData.paperTitle == "" || this.paperData.paperTitle == null) {      
      this._toastrService.warning("Provide Title");
      isValidForm = false;
    }
    else if (this.paperData.paperDesc == "" || this.paperData.paperDesc == null) {      
      this._toastrService.warning("Provide Description");
      isValidForm = false;
    }
    else if (this.selectedQuiz == "" || this.selectedQuiz == null ||
      this.selectedQuiz == "-1") {      
      this._toastrService.warning("Select Quiz");
      isValidForm = false;
    }


    if (isValidForm) {
      this.spinner.show();
      this.errorData = {};
      this.paperData.active = true;
      this.paperData.quizId = this.selectedQuiz;
      this._quizSevice.savePaperData(this.paperData)
        .subscribe(res => {
          let response = res["result"];
          let quizId = response["quizId"];
          this.onChangeObj(quizId);
          this.paperData = {};
          this.spinner.hide();
          this._toastrService.success("Details Saved");
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
    else {
      console.log("incomplete form");
    }
  }

  setPaperData(paper) {
    this.errorData = {};
    this.paperData = Object.assign({}, paper);
  }

  onChangeObj(newObj) {
    //console.log(newObj);
    this.spinner.show();
    this.selectedQuiz = newObj;
    this._quizSevice.fetchQuizPaperData(this.selectedQuiz)
      .subscribe(res => {
        this.paperList = res["result"];
        this.spinner.hide();
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
