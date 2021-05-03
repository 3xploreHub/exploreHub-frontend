import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageConversationsPage } from './page-conversations.page';

describe('PageConversationsPage', () => {
  let component: PageConversationsPage;
  let fixture: ComponentFixture<PageConversationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageConversationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageConversationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
