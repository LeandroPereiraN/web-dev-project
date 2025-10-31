import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicesPages } from './create-services.pages';

describe('CreateServicesPages', () => {
  let component: CreateServicesPages;
  let fixture: ComponentFixture<CreateServicesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServicesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateServicesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
