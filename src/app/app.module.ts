import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { PaperComponent } from './paper/paper.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';
import { QuizService } from './quiz.service';
import { QuestionComponent } from './question/question.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { AddQuizComponent } from './quiz/add-quiz/add-quiz.component';
import { ResultComponent } from './result/result.component';
import { AddPaperComponent } from './paper/add-paper/add-paper.component';
import { AddQuestionComponent } from './question/add-question/add-question.component';
import { AddAnswerComponent } from './question/add-answer/add-answer.component';
import { DataTableModule } from "angular-6-datatable";
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    QuizComponent,
    PaperComponent,
    HomeComponent,
    QuestionComponent,
    AddQuizComponent,
    ResultComponent,
    AddPaperComponent,
    AddQuestionComponent,
    AddAnswerComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true
    }),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DataTableModule
  ],
  providers: [AuthService, QuizService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
