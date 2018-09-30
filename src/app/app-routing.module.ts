import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { PaperComponent } from './paper/paper.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { AuthGuard } from './auth.guard';
import { AddQuizComponent } from './quiz/add-quiz/add-quiz.component';
import { ResultComponent } from './result/result.component';
import { AddQuestionComponent } from './question/add-question/add-question.component';
import { AddPaperComponent } from './paper/add-paper/add-paper.component';
import { AddAnswerComponent } from './question/add-answer/add-answer.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"

  },
  {
    path: "quiz",
    component: QuizComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "paper/:quizId",
    component: PaperComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "question/:quizId/:paperId",
    component: QuestionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "master/quiz",
    component: AddQuizComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "result/:subscriptionId",
    component: ResultComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "master/question/:quizId/:paperId",
    component: AddQuestionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "master/paper",
    component: AddPaperComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"master/answer/:quizId/:paperId",
    component:AddAnswerComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"about",
    component:AboutComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
