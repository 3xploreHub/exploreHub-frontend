import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodeHandlerPage } from './code-handler.page';

describe('CodeHandlerPage', () => {
  let component: CodeHandlerPage;
  let fixture: ComponentFixture<CodeHandlerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeHandlerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeHandlerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
