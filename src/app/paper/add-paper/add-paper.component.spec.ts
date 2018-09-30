import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaperComponent } from './add-paper.component';

describe('AddPaperComponent', () => {
  let component: AddPaperComponent;
  let fixture: ComponentFixture<AddPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
