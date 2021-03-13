import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceListPage } from './service-list.page';

describe('ServiceListPage', () => {
  let component: ServiceListPage;
  let fixture: ComponentFixture<ServiceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
