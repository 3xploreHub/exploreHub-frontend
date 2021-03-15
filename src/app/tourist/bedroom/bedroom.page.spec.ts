import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BedroomPage } from './bedroom.page';

describe('BedroomPage', () => {
  let component: BedroomPage;
  let fixture: ComponentFixture<BedroomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedroomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BedroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
