import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageInputFieldListComponent } from './page-input-field-list.component';

describe('PageInputFieldListComponent', () => {
  let component: PageInputFieldListComponent;
  let fixture: ComponentFixture<PageInputFieldListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInputFieldListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageInputFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
