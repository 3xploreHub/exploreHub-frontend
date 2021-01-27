import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTouristSpotOperationPage } from './create-tourist-spot-operation.page';

describe('CreateTouristSpotOperationPage', () => {
  let component: CreateTouristSpotOperationPage;
  let fixture: ComponentFixture<CreateTouristSpotOperationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTouristSpotOperationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTouristSpotOperationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
