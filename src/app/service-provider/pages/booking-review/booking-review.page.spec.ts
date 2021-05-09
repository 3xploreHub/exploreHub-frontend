import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingReviewPage } from './booking-review.page';

describe('BookingReviewPage', () => {
  let component: BookingReviewPage;
  let fixture: ComponentFixture<BookingReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
