import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerServicePages } from './seller-service.pages';

describe('SellerServicePages', () => {
  let component: SellerServicePages;
  let fixture: ComponentFixture<SellerServicePages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerServicePages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerServicePages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
