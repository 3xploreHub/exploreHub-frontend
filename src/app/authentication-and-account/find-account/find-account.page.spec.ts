import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindAccountPage } from './find-account.page';

describe('FindAccountPage', () => {
  let component: FindAccountPage;
  let fixture: ComponentFixture<FindAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
