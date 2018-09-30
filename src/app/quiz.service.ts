import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private _quizUrl = "/api/quiz";
  private _paperUrl = "/api/paper";
  private _questionUrl = "/api/question";
  private _subscriptionUrl = "/api/subscription";
  private _answerUrl = "/api/answer";
  private _resultUrl = "/api/result";


  constructor(private http: HttpClient) { }

  fetchQuizData() {
    return this.http.get(environment.quizapiurl + this._quizUrl);
  }

  fetchQuizDataById(quizId) {
    return this.http.get(environment.quizapiurl + this._quizUrl + "/" + quizId);
  }


  fetchQuizPaperData(quizId) {
    return this.http.get(environment.quizapiurl + this._paperUrl + "/" + quizId);
  }

  fetchPaperData(quizId, paperId) {
    return this.http.get(environment.quizapiurl + this._paperUrl + "/" + quizId + "/" + paperId);
  }

  fetchQuestionData(quizId, paperId) {
    return this.http.get(environment.quizapiurl + this._questionUrl + "/" + quizId + "/" + paperId);
  }

  fetchSubscriptionData() {
    return this.http.get(environment.quizapiurl + this._subscriptionUrl);
  }

  fetchSubscriptionDatabyId(subscriptionId) {
    return this.http.get(environment.quizapiurl + this._subscriptionUrl + "/" + subscriptionId);
  }

  saveSubscriptionData(subscriptionData) {
    return this.http.post(environment.quizapiurl + this._subscriptionUrl, subscriptionData);
  }

  saveQuizData(quizData) {
    return this.http.post(environment.quizapiurl + this._quizUrl, quizData);
  }

  fetchAnswerData(quizId, paperId) {
    return this.http.get(environment.quizapiurl + this._answerUrl + "/" + quizId + "/" + paperId);
  }

  savePaperData(paperData) {
    return this.http.post(environment.quizapiurl + this._paperUrl, paperData);
  }

  saveQuestionData(questionData) {
    return this.http.post(environment.quizapiurl + this._questionUrl, questionData);
  }

  deleteQuestion(questionId) {
    return this.http.delete(environment.quizapiurl + this._questionUrl + "/" + questionId);
  }

  saveAnswerData(answerData) {
    return this.http.post(environment.quizapiurl + this._answerUrl, answerData);
  }

  saveResultData(resultdata) {
    return this.http.post(environment.quizapiurl + this._resultUrl, resultdata);
  }

  fetchResultData() {
    return this.http.get(environment.quizapiurl + this._resultUrl);
  }
}
