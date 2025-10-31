import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactServicesPages } from './contact-services.pages';

describe('ContactServicesPages', () => {
  let component: ContactServicesPages;
  let fixture: ComponentFixture<ContactServicesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactServicesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactServicesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
