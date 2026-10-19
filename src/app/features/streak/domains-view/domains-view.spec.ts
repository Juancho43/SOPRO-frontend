import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsView } from './domains-view';

describe('DomainsView', () => {
  let component: DomainsView;
  let fixture: ComponentFixture<DomainsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainsView],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
