import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedSellersPages } from './reported-sellers.pages';

describe('ReportedSellersPages', () => {
  let component: ReportedSellersPages;
  let fixture: ComponentFixture<ReportedSellersPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedSellersPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedSellersPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
