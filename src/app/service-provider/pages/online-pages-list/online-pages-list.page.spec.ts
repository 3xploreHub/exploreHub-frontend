import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnlinePagesListPage } from './online-pages-list.page';

describe('OnlinePagesListPage', () => {
  let component: OnlinePagesListPage;
  let fixture: ComponentFixture<OnlinePagesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePagesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnlinePagesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
