import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
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
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';
import { popupData } from '../../view-booking-as-provider/view-booking-as-provider.page';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.page.html',
  styleUrls: ['./view-page.page.scss', '../../../modules/page-creator/page-creator.component.scss'],
})
export class ViewPagePage implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @Input() page: Page = { _id: "", pageType: "", otherServices: [], status: "", components: [{}, { data: { text: "----------" } }], services: [], bookingInfo: [], creator: "", hostTouristSpot: "", createdAt: "" }
  public boxPosition: number;
  public otherServices: Page[] = [];
  public pageType: string;
  public fromHostedList: boolean;
  public parentPageCreator: string;
  public popupData: popupData;
  screenHeight = window.innerHeight - 80;
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
    public authService: AuthService,
    public creator: PageCreatorService) {

      this.popupData = {
        title: "",
        otherInfo: "",
        type: '',
        show: false
      }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.fromHostedList && params.parentPageCreator) {
          this.authService.getCurrentUser().then((user: any) => {
            if (user._id == params.parentPageCreator) {
              this.parentPageCreator = params.parentPageCreator
              this.fromHostedList = true
            }
          })
        }
      }
    )
    this.route.paramMap.subscribe(params => {
      const pageId = params.get('pageId');
      this.pageType = params.get('pageType')

      this.mainService.viewPage({ pageId: pageId, pageType: this.pageType }).subscribe(
        (response: any) => {
          this.page = response;
          this.otherServices = this.page.otherServices
          this.mainService.currentPage = this.page;

          this.setPage(this.page);
        }
      )
    })
  }
  setPage(page) {
    if (this.pageElement) this.pageElement.clear()
    if (this.pageService) this.pageService.clear();
    this.creator.preview = true;
    setTimeout(() => {
      const address = this.page.components.splice(2, 3);
      const location = { ...address[0], data: { ...address[0].data } }
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
    }, 100);

  }

  onScroll(event, info: HTMLElement, services: HTMLElement, bookingInfo: HTMLElement, div: HTMLElement) {
    const width = div.clientWidth;


    const scrolled = event.detail.scrollTop + 100;

    if (info && info.clientHeight >= scrolled) {
      this.boxPosition = 0;
    }
    if (info && info.clientHeight <= scrolled) {
      this.boxPosition = width;
    }

    if (info && services && (info.clientHeight + services.clientHeight) <= scrolled) {
      this.boxPosition = width * 2;
    }
  }

  goToSection(el: HTMLElement, tab: string, div: HTMLElement) {
    const width = div.clientWidth;
    switch (tab) {
      case 'others':
        if (this.otherServices.length > 0) {
          this.boxPosition = width * 2;
        }
        break;
      case 'services':
        if (this.page.services.length > 0) {
          this.boxPosition = width;
        }
        break;
      default:
        this.boxPosition = 0
        break;
    }
    if (el) el.scrollIntoView();
  }

  renderComponent(type: ViewContainerRef, componentValues: any, parent) {
    if (componentValues.type && type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = type.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.page._id;
      comp.instance.parent = parent;
      comp.instance.emitEvent = new EventEmitter();
      comp.instance.emitEvent.subscribe(data => this.catchEvent(data))
    }
  }

  createBooking() {
    setTimeout(() => {
      const data = { pageId: this.page._id, pageType: this.page.pageType, firstService: null, bookingId: "create_new" };
      this.mainService.createBooking(data).subscribe(
        (response: bookingData) => {
          this.router.navigate(["/service-provider/select-service", this.page._id, response._id])
        }
      )
    }, 100);
  }

  catchEvent(data) {
    if (data.userInput) {
    } else {
      this.viewItem(data)
    }
  }

  viewItem(data) {
    this.router.navigate(["/service-provider/view-item", this.page._id, data.serviceId, data.itemId, this.pageType, "create_new"])
  }

  viewService(serviceId) {
    this.router.navigate(["/service-provider/view-page", serviceId, "service"])
  }

  viewAllServices() {
    this.router.navigate(["/service-provider/all-services", this.page._id])
  }

  approve(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.popupData = {
        type: 'change_page_status',
        title: this.page.status == "Online" ? `Are you sure you want to set page status to "Not Operating"` : `Are you sure want set the page status to "Online"?`,
        otherInfo: this.page.status == "Online" ? 'The page will no longer be visible online.' : 'The page will be visible online by the tourist and other service providers',
        show: true
      }
    }, 200);
  }

}
