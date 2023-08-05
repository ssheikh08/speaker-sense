import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsPresentationComponent } from './analytics-presentation.component';

describe('AnalyticsPresentationComponent', () => {
  let component: AnalyticsPresentationComponent;
  let fixture: ComponentFixture<AnalyticsPresentationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsPresentationComponent]
    });
    fixture = TestBed.createComponent(AnalyticsPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
