import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PastvisitPage } from './pastvisit.page';

describe('PastvisitPage', () => {
  let component: PastvisitPage;
  let fixture: ComponentFixture<PastvisitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PastvisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
