import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SideBarPage } from './side-bar.page';

describe('SideBarPage', () => {
  let component: SideBarPage;
  let fixture: ComponentFixture<SideBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
