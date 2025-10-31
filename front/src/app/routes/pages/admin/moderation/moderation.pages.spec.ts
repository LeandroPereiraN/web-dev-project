import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationPages } from './moderation.pages';

describe('ModerationPages', () => {
  let component: ModerationPages;
  let fixture: ComponentFixture<ModerationPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
