import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { Page } from '../../elementTools/interfaces/page';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from '../../page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { LabelledTextDisplayComponent } from '../../page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from '../../page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from '../../page-elements-display/text-display/text-display.component';
import { ChoicesInputDisplayComponent } from '../../page-input-field-display/choices-input-display/choices-input-display.component';
import { DateInputDisplayComponent } from '../../page-input-field-display/date-input-display/date-input-display.component';
import { NumberInputDisplayComponent } from '../../page-input-field-display/number-input-display/number-input-display.component';
import { TextInputDisplayComponent } from '../../page-input-field-display/text-input-display/text-input-display.component';
import { ItemListDisplayComponent } from '../../page-services-display/item-list-display/item-list-display.component';

@Component({
  selector: 'app-view-page-component',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss', '../../page-creator/page-creator.component.scss'],
})
export class ViewPageComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  @Output() viewItem: EventEmitter<any> = new EventEmitter();
  @Input() page: Page;
  public boxPosition: number;
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

  }
  setPage(page, pageType) {
    this.pageElement.clear()
    this.pageService.clear();
    this.pageInputField.clear();
    this.pageType = page.hostTouristSpot? 'service': 'tourist_spot'
    setTimeout(() => {

      this.creator.pageType = pageType;
      this.creator.canLeave = false;
      this.creator.preview = false;
      this.page = page;
      this.creator.currentPageId = this.page._id;
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

  onScroll(event, info: HTMLElement, services: HTMLElement, div: HTMLElement) {

    const width = div.clientWidth;

    const scrolled = event.detail.scrollTop;

    if (info.clientHeight >= scrolled) {
      this.boxPosition = 0;
    }
    if (info.clientHeight < scrolled) {
      this.boxPosition = width;
    }
    if ((info.clientHeight + services.clientHeight) < scrolled) {
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
      comp.instance.emitEvent.subscribe(data => this.viewItem.emit({...data, pageType: this.pageType}))
    }
  }

}
