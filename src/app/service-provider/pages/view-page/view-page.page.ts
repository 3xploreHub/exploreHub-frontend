import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
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
import { WeatherComponent } from 'src/app/modules/common-components/weather/weather.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.page.html',
  styleUrls: ['./view-page.page.scss', '../../../modules/page-creator/page-creator.component.scss'],
})
export class ViewPagePage implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @Input() page: Page = { _id: "", pageType: "", otherServices: [], status: "", initialStatus: "", components: [{}, { data: { text: "----------" } }], services: [], bookingInfo: [], creator: "", hostTouristSpot: "", createdAt: "" }
  public boxPosition: number;
  public otherServices: Page[] = [];
  public pageType: string;
  loading = true
  public loadingWeather:boolean = false
  public fromHostedList: boolean;
  api = environment.apiUrl
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
  weatherToday = {
    icon:  `assets/icons/rain.png`,
    temp: null,
    weather: 'light rain',
  }
  constructor(
    public mainService: MainServicesService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public route: ActivatedRoute,
    public alert:AlertController,
    public modalCtrl: ModalController,
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
    // this.getWeather();
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
          this.loading = false
          this.page = response;
          // this.page.services = this.page.services.map(service => {
          //   service.data = service.data.map(item => {
          //     let available = 0
          //     if (item.type == "item") {
          //       item.data = item.data.map(component => {
          //         if (component.data.defaultName == "quantity") {
          //           component.data.label = "Available"
          //           const booked = (item["booked"] + item["manuallyBooked"] + item["toBeBooked"])

          //           available = component.data.text - booked
          //           available = available == null || available == NaN ? 0 : available
          //           component.data.text = available
          //         }
          //         return component
          //       })
          //       if (available != 0) return item
          //     } else {

          //       return item
          //     }
          //   })
          //   service.data = service.data.filter(serv => serv)
          //   const items = service.data.filter(serv => serv.type == "item")
          //   if (items.length > 0) return service
          // })
          // this.page.services = this.page.services.filter(service =>  service)

          
          console.log(this.page.services);
          
          this.otherServices = this.page.otherServices
          this.mainService.currentPage = this.page;

          this.setPage(this.page);
        }
      )
    })
    this.mainService.notification.subscribe((data: any) => {
      if (data.type == "page-status-edit" && data.pageId == this.page._id) {
        this.page.status = data.status
      }
    })
  }
  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
  setPage(page) {
    if (this.pageElement) this.pageElement.clear()
    if (this.pageService) this.pageService.clear();
    this.creator.preview = true;
    setTimeout(() => {
      let address = this.page.components.splice(2, 3);
      const location = { ...address[0], data: { ...address[0].data } }
      location.data.text = "";
      location.data.label = "Location"

      address = address.map(data => data.data.text)
      location.data.text = address.join(", ")

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
    // const width = div.clientWidth;


    // const scrolled = event.detail.scrollTop + 100;

    // if (info && info.clientHeight >= scrolled) {
    //   this.boxPosition = 0;
    // }
    // if (info && info.clientHeight <= scrolled) {
    //   this.boxPosition = width;
    // }

    // if (info && services && (info.clientHeight + services.clientHeight) <= scrolled) {
    //   this.boxPosition = width * 2;
    // }
  }

  goToSection(el: HTMLElement, tab: string, div: HTMLElement) {
    // const width = div.clientWidth;
    // switch (tab) {
    //   case 'others':
    //     if (this.otherServices.length > 0) {
    //       this.boxPosition = width * 2;
    //     }
    //     break;
    //   case 'services':
    //     if (this.page.services.length > 0) {
    //       this.boxPosition = width;
    //     }
    //     break;
    //   default:
    //     this.boxPosition = 0
    //     break;
    // }
    // if (el) el.scrollIntoView();
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
          if (this.page.services.length > 0) {
            this.router.navigate(["/service-provider/select-service", this.page._id, response._id])
          } else {
            this.router.navigate(["/service-provider/book", this.page._id, this.page.pageType, response._id], {queryParams: {noServices: true}})
          }
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
    const serviceList = this.page.services.filter(service => service._id == data.serviceId)
    console.log(serviceList)
    const params = this.page.status == "Not Operating"? {queryParams: {notOperating: true, inputQuantity: serviceList[0]['inputQuantity']}}: {queryParams: {inputQuantity: serviceList[0]['inputQuantity']}}

    this.router.navigate(["/service-provider/view-item", this.page._id, data.serviceId, data.itemId, this.pageType, "create_new"], params)
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
        type: 'approve',
        title: `Are you sure you want to approve this service`,
        otherInfo: 'This service will be visible within your page in the <b>Other Services</b> section.',
        show: true
      }
    }, 200);
  }

  decline(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.popupData = {
        type: 'decline',
        title: `Are you sure you want to decline this service`,
        otherInfo: 'This service will not be visible within your page',
        show: true
      }
    }, 200);
  }

  clicked(action) {
    if (action == "yes") {
      let status = "Declined"
      if (this.popupData.type == "approve") status = "Approved"
      let name = this.getPageName()
      let message = this.popupData.type == "approve"? `The owner of <b>${this.getPageName(this.page.hostTouristSpot)}</b> approved your service named <b>${name}</b>` :`The owner of <b>${this.getPageName(this.page.hostTouristSpot)}</b> declined your service named <b>${name}</b>`
      let notificationData = {
        receiver:  this.page.creator,
        mainReceiver: this.page.creator,
        page: this.page._id,
        booking: null,
        sender: this.mainService.user._id,
        subject: this.page._id,
        message:message ,
        type: "page-provider",
      }
      this.mainService.changeInitialStatus({ pageId: this.page._id, status: status , notificationData: notificationData}).subscribe(
        (data: any) => {
          this.page.initialStatus = status
          this.mainService.notify({user: this.mainService.user,pageId: this.page._id, initialStatus: status, receiver: [this.page.creator, "admin"], type: "page-submission", message: message})
        }
      )
    } else {
    }
    this.popupData.show = false;
  }

  getPageName(page: any = null) {
    let name = "Untitled"
    const pageData:Page = page? page: this.page
    pageData.components.forEach(comp => {
      if (comp.data && comp.data.defaultName == "pageName") {
        name = comp.data.text;
      }
    })
    return name;
  }

  message() {
    setTimeout(() => {
      this.router.navigate(["/service-provider/page-chat"], { queryParams: { pageId: this.page._id, type: "host_page_creator_approval", receiver: this.page.creator, receiverName: this.getPageName() } })
    }, 300);
  }

  resportPage() {
    setTimeout(() => {
      this.router.navigate(["/service-provider/page-chat"], { queryParams: { pageId: this.page.hostTouristSpot["_id"], type: "admin_approval", receiver: this.mainService.user.admin, receiverName: "(Admin) - "+this.getPageName(this.page.hostTouristSpot),pageToReport: this.page._id } })
    }, 300);
  }

  async checkWeather() {
    const modal = await this.modalCtrl.create({
      component: WeatherComponent
    });
    return await modal.present();
  }

  getWeather() {
    fetch(`${environment.weatherMap_base_url}weather?q=moalboal,cebu&APPID=${environment.weatherMap_api_key}`)
      .then(weather => {
         this.loadingWeather = false
         return weather.json();
      }).then(weatherCondition => {
        this.loadingWeather = false
        console.log("WEATHER CONDITION: ", weatherCondition)
        let weatherNow = weatherCondition.weather[0].description;
        let temp = weatherCondition.main.temp;

        this.weatherToday.temp = this.getCelciusTemp(temp);
        this.weatherToday.weather = weatherNow;

        if(weatherNow == 'broken clouds' || weatherNow == 'overcast clouds') {
          this.weatherToday.icon = `assets/icons/broken clouds.png`
        }
        if(weatherNow == 'rain' || weatherNow == 'light rain' || weatherNow == 'moderate rain' || weatherNow == 'heavy intensity rain' || weatherNow == 'very heavy rain' || weatherNow == 'extreme rain' ) {
          this.weatherToday.icon = `assets/icons/rain.png`
        }
        if(weatherNow == 'freezing rain') {
          this.weatherToday.icon = `assets/icons/freezing rain.png`
        }

        if(weatherNow == 'light intensity shower rain' || weatherNow == 'shower rain' || weatherNow == 'heavy intensity shower rain' || weatherNow == 'ragged shower rain' ||
          weatherNow == 'light intensity drizzle' || weatherNow == 'drizzle' || weatherNow == 'heavy intensity drizzle' || weatherNow == 'light intensity drizzle rain' || weatherNow == 'drizzle rain' || weatherNow == 'heavy intensity drizzle rain' || weatherNow == 'shower rain and drizzle' ||  weatherNow == 'heavy shower rain and drizzle' || weatherNow == 'shower drizzle') {
          this.weatherToday.icon = `assets/icons/shower rain.png`
        }
        if(weatherNow.includes('thunderstorm')) {
          this.weatherToday.icon = `assets/icons/thunderstorm.png`;
        }
        if(weatherNow == 'few clouds') {
          this.weatherToday.icon = `assets/icons/few clouds.png`;
        }
        if(weatherNow == 'clear sky') {
          this.weatherToday.icon = `assets/icons/clear sky.png`;
        }
        if(weatherNow == 'scattered clouds') {
          this.weatherToday.icon = `assets/icons/scattered clouds.png`;
        }
      })
  }

  getCelciusTemp(value) {
    return (Math.floor(value - 273));
  }
}
