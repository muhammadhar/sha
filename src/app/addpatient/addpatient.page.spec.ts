import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddpatientPage } from './addpatient.page';

describe('AddpatientPage', () => {
  let component: AddpatientPage;
  let fixture: ComponentFixture<AddpatientPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddpatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
