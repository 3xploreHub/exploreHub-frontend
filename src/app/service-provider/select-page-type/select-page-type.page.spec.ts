import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPageTypePage } from './select-page-type.page';

describe('SelectPageTypePage', () => {
  let component: SelectPageTypePage;
  let fixture: ComponentFixture<SelectPageTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPageTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPageTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
