import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicesPages } from './list-services.pages';

describe('ListServicesPages', () => {
  let component: ListServicesPages;
  let fixture: ComponentFixture<ListServicesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListServicesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListServicesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
