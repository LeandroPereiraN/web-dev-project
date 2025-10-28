import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyServicePage } from './my-service.page';

describe('MyServicePage', () => {
  let component: MyServicePage;
  let fixture: ComponentFixture<MyServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyServicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
