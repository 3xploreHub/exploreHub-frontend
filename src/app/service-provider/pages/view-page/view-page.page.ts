import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewPageComponent } from 'src/app/modules/common-components/view-page/view-page.component';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from 'src/app/modules/page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from 'src/app/modules/page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from 'src/app/modules/page-elements-display/text-display/text-display.component';
import { ChoicesInputDisplayComponent } from 'src/app/modules/page-input-field-display/choices-input-display/choices-input-display.component';
import { DateInputDisplayComponent } from 'src/app/modules/page-input-field-display/date-input-display/date-input-display.component';
import { NumberInputDisplayComponent } from 'src/app/modules/page-input-field-display/number-input-display/number-input-display.component';
import { TextInputDisplayComponent } from 'src/app/modules/page-input-field-display/text-input-display/text-input-display.component';
import { ItemListDisplayComponent } from 'src/app/modules/page-services-display/item-list-display/item-list-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.page.html',
  styleUrls: ['./view-page.page.scss', '../../../modules/page-creator/page-creator.component.scss'],
})
export class ViewPagePage implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  @Input() page: Page;
  public boxPosition: number;
  public otherServices: Page[] = [];
  public pageType: string;
  components = {
    'text': TextDisplayComponent,
    'bullet-form-text': BulletFormTextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
    'item-list': ItemListDisplayComponent,
    'text-input': TextInputDisplayComponent,
    'number-input': NumberInputDisplayComponent,
    'date-input': DateInputDisplayComponent,
    'choices-input': ChoicesInputDisplayComponent
  }
  constructor(
    public mainService: MainServicesService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public route: ActivatedRoute,
    public router: Router,
    public creator: PageCreatorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pageId = params.get('pageId');
      const pageType = params.get('pageType')
      this.mainService.viewPage({pageId: pageId,pageType: pageType}).subscribe(
        (response: any) => {
          this.page = response.page;
          this.otherServices = response.otherServices
          console.log(this.otherServices);
          
          this.setPage(this.page);
        }
      )
    })
  }
  setPage(page) {
    this.pageElement.clear()
    this.pageService.clear();
    this.pageInputField.clear();
    this.pageType = this.page.hostTouristSpot ? 'service' : 'tourist_spot'
    this.creator.preview = true;
    setTimeout(() => {
      this.page = page;
      const address = this.page.components.splice(2, 3);
      const location = {...address[0], data: {...address[0].data}}
      location.data.text = "";
      location.data.label = "Location"
      
      
      for (let i = 0; i < address.length; i++) {
        const comp = address[i];
        location.data.text += comp.data.text
        if (i != address.length - 1) {
          location.data.text += ", "
        }
      }

      this.page.components = [...this.page.components.slice(0, 2), location, ...this.page.components.slice(2)]
      
      this.page.components.forEach((component: any) => {
        this.renderComponent(this.pageElement, component, "page")
      })
      this.page.services.forEach((component: any) => {
        this.renderComponent(this.pageService, component, "page")
      })

      this.page.bookingInfo.forEach((component: any) => {
        this.renderComponent(this.pageInputField, component, "page_booking_info")
      })
    }, 100);

  }

  onScroll(event, info: HTMLElement, services: HTMLElement, bookingInfo: HTMLElement, div: HTMLElement) {
    const width = div.clientWidth;

    const scrolled = event.detail.scrollTop + 100;    

    if (info.clientHeight >= scrolled) {
      this.boxPosition = 0;
    }
    if (info.clientHeight <= scrolled) {
      this.boxPosition = width;
    }

    if ((info.clientHeight + services.clientHeight) <= scrolled) {
      this.boxPosition = width * 2;
    }
  }

  goToSection(el: HTMLElement, tab: string, div: HTMLElement) {
    const width = div.clientWidth;
    switch (tab) {
      case 'booking':
        this.boxPosition = width * 2;
        break;
      case 'services':
        this.boxPosition = width;
        break;
      default:
        this.boxPosition = 0
        break;
    }
    el.scrollIntoView();
  }

  renderComponent(type: ViewContainerRef, componentValues: any, parent) {
    if (componentValues.type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = type.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.page._id;
      comp.instance.parent = parent;
      comp.instance.emitEvent = new EventEmitter();
      comp.instance.emitEvent.subscribe(data => this.viewItem(data))
    }
  }

 viewItem(data) {
    this.router.navigate(["/service-provider/view-item", this.page._id, data.serviceId, data.itemId, this.pageType])
  }

  viewService(serviceId) {
    this.router.navigate(["/service-provider/view-page", serviceId, "service"])
  }
}
