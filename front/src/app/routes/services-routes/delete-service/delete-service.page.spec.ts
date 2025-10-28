import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteServicePage } from './delete-service.page';

describe('DeleteServicePage', () => {
  let component: DeleteServicePage;
  let fixture: ComponentFixture<DeleteServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteServicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
