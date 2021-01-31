import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateServicePagePage } from './create-service-page.page';

describe('CreateServicePagePage', () => {
  let component: CreateServicePagePage;
  let fixture: ComponentFixture<CreateServicePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServicePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateServicePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
