import { Component, ComponentFactoryResolver, EventEmitter, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { ChoicesInputDisplayComponent } from 'src/app/modules/page-input-field-display/choices-input-display/choices-input-display.component';
import { DateInputDisplayComponent } from 'src/app/modules/page-input-field-display/date-input-display/date-input-display.component';
import { NumberInputDisplayComponent } from 'src/app/modules/page-input-field-display/number-input-display/number-input-display.component';
import { TextInputDisplayComponent } from 'src/app/modules/page-input-field-display/text-input-display/text-input-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss',  '../../../modules/page-creator/page-creator.component.scss'],
})
export class BookPage implements OnInit, ViewWillEnter {
  public bookingInfo: ElementValues[] = [];
  public pageType: string;
  public pageId: string;
  components = {
    'text-input': TextInputDisplayComponent,
    'number-input': NumberInputDisplayComponent,
    'date-input': DateInputDisplayComponent,
    'choices-input': ChoicesInputDisplayComponent
  }
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  constructor(
    public route: ActivatedRoute, 
    public mainService: MainServicesService, 
    public creator: PageCreatorService,
    public componentFactoryResolver: ComponentFactoryResolver
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageId = params.get('pageId');
      this.pageType = params.get('pageType')
      this.mainService.viewPage({ pageId: this.pageId, pageType: this.pageType }).subscribe(
        (response: any) => {
          this.bookingInfo = response.page.bookingInfo;
          this.setPage(this.bookingInfo);
        }
      )
    })
  }

  
  ionViewWillEnter() {
    this.bookingInfo = [];
  }

  setPage(page) {
    if (this.pageInputField) this.pageInputField.clear()
    this.creator.preview = true;
    setTimeout(() => {


      this.bookingInfo.forEach((component: any) => {
        this.renderComponent(component, "page_booking_info")
      })
    

    }, 100);

  }

  
  renderComponent(componentValues: any, parent) {
    if (componentValues.type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = this.pageInputField.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.pageId
      comp.instance.parent = parent;
      comp.instance.emitEvent = new EventEmitter();
      comp.instance.emitEvent.subscribe(data => this.catchEvent(data))
    }
  }


  catchEvent(data) {
    if (data.userInput) {
      console.log(data);
    } 
  }


}
