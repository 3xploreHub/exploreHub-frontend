import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageHostedServicesPage } from './page-hosted-services.page';

describe('PageHostedServicesPage', () => {
  let component: PageHostedServicesPage;
  let fixture: ComponentFixture<PageHostedServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHostedServicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHostedServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
