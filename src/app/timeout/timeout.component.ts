import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css']
})
export class TimeoutComponent implements OnInit {

  private paperId: any;
  private quizId: any;

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.quizId = params["quizId"];
      this.paperId = params["paperId"];
    });
  }

  restartQuiz() {

    if (this.quizId && this.paperId) {

      this._router.navigate(["/question", this.quizId, this.paperId]);
    }
  }

}
