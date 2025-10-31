import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServicesPages } from './detail-services.pages';

describe('DetailServicesPages', () => {
  let component: DetailServicesPages;
  let fixture: ComponentFixture<DetailServicesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailServicesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailServicesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
