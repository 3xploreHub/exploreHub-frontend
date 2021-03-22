import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulletFormTextDisplayComponent } from './bullet-form-text-display.component';

describe('BulletFormTextDisplayComponent', () => {
  let component: BulletFormTextDisplayComponent;
  let fixture: ComponentFixture<BulletFormTextDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletFormTextDisplayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BulletFormTextDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
