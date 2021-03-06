import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListOfPagesPage } from './list-of-pages.page';

describe('ListOfPagesPage', () => {
  let component: ListOfPagesPage;
  let fixture: ComponentFixture<ListOfPagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfPagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfPagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
