import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingInformationPage } from './booking-information.page';

describe('BookingInformationPage', () => {
  let component: BookingInformationPage;
  let fixture: ComponentFixture<BookingInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
