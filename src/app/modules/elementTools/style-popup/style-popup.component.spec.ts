import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StylePopupComponent } from './style-popup.component';

describe('StylePopupComponent', () => {
  let component: StylePopupComponent;
  let fixture: ComponentFixture<StylePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylePopupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StylePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
