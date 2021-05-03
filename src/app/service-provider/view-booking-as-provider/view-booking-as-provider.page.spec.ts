import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewBookingAsProviderPage } from './view-booking-as-provider.page';

describe('ViewBookingAsProviderPage', () => {
  let component: ViewBookingAsProviderPage;
  let fixture: ComponentFixture<ViewBookingAsProviderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBookingAsProviderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBookingAsProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
