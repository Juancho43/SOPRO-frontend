import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAlert } from './update-alert';

describe('UpdateAlert', () => {
  let component: UpdateAlert;
  let fixture: ComponentFixture<UpdateAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
