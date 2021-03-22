import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulletFormTextComponent } from './bullet-form-text.component';

describe('BulletFormTextComponent', () => {
  let component: BulletFormTextComponent;
  let fixture: ComponentFixture<BulletFormTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletFormTextComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BulletFormTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
