import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsPages } from './reports.pages';

describe('ReportsPages', () => {
  let component: ReportsPages;
  let fixture: ComponentFixture<ReportsPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
