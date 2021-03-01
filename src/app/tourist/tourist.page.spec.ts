import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TouristPage } from './tourist.page';

describe('TouristPage', () => {
  let component: TouristPage;
  let fixture: ComponentFixture<TouristPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouristPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TouristPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
