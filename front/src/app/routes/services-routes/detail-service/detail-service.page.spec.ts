import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServicePage } from './detail-service.page';

describe('DetailServicePage', () => {
  let component: DetailServicePage;
  let fixture: ComponentFixture<DetailServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailServicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
