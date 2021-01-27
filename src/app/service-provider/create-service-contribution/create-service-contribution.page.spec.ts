import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateServiceContributionPage } from './create-service-contribution.page';

describe('CreateServiceContributionPage', () => {
  let component: CreateServiceContributionPage;
  let fixture: ComponentFixture<CreateServiceContributionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServiceContributionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateServiceContributionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
