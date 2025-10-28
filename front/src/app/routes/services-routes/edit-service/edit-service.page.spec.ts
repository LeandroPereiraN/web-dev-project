import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicePage } from './edit-service.page';

describe('EditServicePage', () => {
  let component: EditServicePage;
  let fixture: ComponentFixture<EditServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditServicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
