import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainForm } from './domain-form';

describe('DomainForm', () => {
  let component: DomainForm;
  let fixture: ComponentFixture<DomainForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
