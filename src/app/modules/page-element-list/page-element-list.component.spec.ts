import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageElementListComponent } from './page-element-list.component';

describe('PageElementListComponent', () => {
  let component: PageElementListComponent;
  let fixture: ComponentFixture<PageElementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageElementListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
