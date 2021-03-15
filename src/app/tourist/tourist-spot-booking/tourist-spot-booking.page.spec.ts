import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TouristSpotBookingPage } from './tourist-spot-booking.page';

describe('TouristSpotBookingPage', () => {
  let component: TouristSpotBookingPage;
  let fixture: ComponentFixture<TouristSpotBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouristSpotBookingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TouristSpotBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
