import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentvisitPage } from './currentvisit.page';

describe('CurrentvisitPage', () => {
  let component: CurrentvisitPage;
  let fixture: ComponentFixture<CurrentvisitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CurrentvisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
