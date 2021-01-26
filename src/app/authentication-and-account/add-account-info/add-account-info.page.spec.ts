import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAccountInfoPage } from './add-account-info.page';

describe('AddAccountInfoPage', () => {
  let component: AddAccountInfoPage;
  let fixture: ComponentFixture<AddAccountInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAccountInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
