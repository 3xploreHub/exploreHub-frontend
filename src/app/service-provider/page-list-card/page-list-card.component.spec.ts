import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageListCardComponent } from './page-list-card.component';

describe('PageListCardComponent', () => {
  let component: PageListCardComponent;
  let fixture: ComponentFixture<PageListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
