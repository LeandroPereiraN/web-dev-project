import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicePage } from './create-service.page';

describe('CreateServicePage', () => {
  let component: CreateServicePage;
  let fixture: ComponentFixture<CreateServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
