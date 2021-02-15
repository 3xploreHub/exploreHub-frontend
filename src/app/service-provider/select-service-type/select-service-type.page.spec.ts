import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectServiceTypePage } from './select-service-type.page';

describe('SelectServiceTypePage', () => {
  let component: SelectServiceTypePage;
  let fixture: ComponentFixture<SelectServiceTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectServiceTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectServiceTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
