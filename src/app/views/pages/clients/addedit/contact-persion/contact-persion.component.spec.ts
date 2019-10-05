import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPersionComponent } from './contact-persion.component';

describe('ContactPersionComponent', () => {
  let component: ContactPersionComponent;
  let fixture: ComponentFixture<ContactPersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
