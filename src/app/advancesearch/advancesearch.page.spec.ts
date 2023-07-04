import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancesearchPage } from './advancesearch.page';

describe('AdvancesearchPage', () => {
  let component: AdvancesearchPage;
  let fixture: ComponentFixture<AdvancesearchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdvancesearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
