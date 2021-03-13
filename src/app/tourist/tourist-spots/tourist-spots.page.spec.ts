import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TouristSpotsPage } from './tourist-spots.page';

describe('TouristSpotsPage', () => {
  let component: TouristSpotsPage;
  let fixture: ComponentFixture<TouristSpotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouristSpotsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TouristSpotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
