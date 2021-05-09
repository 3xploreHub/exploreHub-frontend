import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComponentsModulePage } from './components-module.page';

describe('ComponentsModulePage', () => {
  let component: ComponentsModulePage;
  let fixture: ComponentFixture<ComponentsModulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentsModulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
