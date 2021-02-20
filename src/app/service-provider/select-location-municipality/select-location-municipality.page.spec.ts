import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLocationMunicipalityPage } from './select-location-municipality.page';

describe('SelectLocationMunicipalityPage', () => {
  let component: SelectLocationMunicipalityPage;
  let fixture: ComponentFixture<SelectLocationMunicipalityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLocationMunicipalityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLocationMunicipalityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
