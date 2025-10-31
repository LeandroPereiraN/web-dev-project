import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicesPages } from './edit-services.pages';

describe('EditServicesPages', () => {
  let component: EditServicesPages;
  let fixture: ComponentFixture<EditServicesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditServicesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditServicesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
