import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageCardComponent } from './page-card.component';

describe('PageCardComponent', () => {
  let component: PageCardComponent;
  let fixture: ComponentFixture<PageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
