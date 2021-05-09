import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageChatPage } from './page-chat.page';

describe('PageChatPage', () => {
  let component: PageChatPage;
  let fixture: ComponentFixture<PageChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
