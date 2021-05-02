import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { ItemListDisplayComponent } from 'src/app/modules/page-services-display/item-list-display/item-list-display.component';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.page.html',
  styleUrls: ['./select-service.page.scss'],
})
export class SelectServicePage implements AfterViewInit, ViewWillEnter {
  public booking: bookingData = {
    _id: "", tourist: "", page: [], createdAt: "", services: [], pageId: "", bookingInfo: [], bookingType: "", isManual: false, selectedServices: [], status: ""
  };
  public pageId: string;
  public pageServices: ElementValues[];
  @ViewChild('services', { read: ViewContainerRef }) services: ViewContainerRef;
  public selected: any[] = []
  public notSelected: ElementValues[] = []
  public fromDraft: boolean = false;
  public editing: boolean = false
  public isManual: boolean = false;
  public fromReviewBooking: boolean = false;
  constructor(public componentFactoryResolver: ComponentFactoryResolver,
    public router: Router,
    public route: ActivatedRoute,
    public alert: AlertController,
    public mainService: MainServicesService) { }

  ionViewWillEnter() {
    this.selected = [];
    this.notSelected = []
    this.mainService.canLeave = false;
    this.checkParams()

    this.mainService.hasUnfinishedBooking = true;
  }

  ngAfterViewInit() {
    // this.selected = [];
    // this.notSelected = []
    // this.mainService.canLeave = false;
    // this.checkParams()
    // this.mainService.hasUnfinishedBooking = true;
    this.checkParams()
    this.route.paramMap.subscribe(params => {
      const bookingId = params.get("bookingId")
      this.mainService.currentBookingId = bookingId;
      this.pageId = params.get("pageId")
      this.mainService.getBooking(bookingId).subscribe(
        (response: any) => {
          this.booking = response.bookingData;
          this.pageServices = response.services;
          this.checkAvailedServices();
          this.renderServices(this.notSelected);
        },
        error => {
          if (error.status == 404) {
            this.router.navigate(["/service-provider/online-pages-list"])
          }
        }
      )
    })
  }

  checkParams() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.fromReviewBooking) {
          this.fromReviewBooking = true
        }
        if (params.draft) {
          this.fromDraft = true
        }
        if (params.edit) {
          this.mainService.canLeave = true
          this.editing = true;
        }
        if (params.manual) {
          this.isManual = true
        }
      }

    })
  }

  getServiceName(data, defaultName) {
    let name;
    data.data.forEach(component => {
      if (component.data && component.data.defaultName && component.data.defaultName == defaultName) {
        name = component.data.text
      }
    });
    if (!name && defaultName == "name" && data.type == "item-list") {
      if (data.data[0].type == "text") {
        name = data.data[0].data.text;
      }
    }
    return name;
  }

  checkAvailedServices() {
    this.pageServices.forEach(itemList => {
      let selected = false;
      let servQuant = 0;
      this.booking.selectedServices.forEach((item: any) => {
        if (item.serviceGroupId == itemList._id) {
          selected = true;
          let selectedItem = { groupName: this.getServiceName(itemList, "name"), serviceName: item.serviceName }
          itemList.data.forEach(service => {
            if (service._id == item.serviceId) {
              selectedItem["service"] = service;
              this.selected.push(selectedItem); 
            }
            if (service.type == "item") {
              service.data.forEach(element => {
                if (element.data.defaultName == "quantity") {
                  servQuant += parseInt(element.data.text)
                }
              });
            }
          });
        }
      })
      servQuant = this.getTotalValue(itemList)
      if (!selected || itemList["selectMultiple"]) {
        if (servQuant > 0) {
          this.notSelected = this.notSelected.filter(item => item._id != itemList._id)
          this.notSelected.push(itemList);
        }
      }
    });
  }

  renderServices(services) {
    this.services.clear();
    if (this.services) {
      // services = services.map(itemList => {
      //   itemList.data = itemList.data.filter(item => {
      //     if (item.type == "item") { 
      //       const quantity = item.data.filter(data => {
      //         if (data.data.defaultName == "quantity") {
      //           return data
      //         }
      //       })
      //       console.log(quantity[0].data.text, item);
      //       if (quantity[0].data.text > 0) return item;
      //     } else { 
      //       return item
      //     }
      //   })
      //   return itemList
      // })
      // console.log(services);
      
      services.forEach(service => {
          
          const factory = this.componentFactoryResolver.resolveComponentFactory(ItemListDisplayComponent);
          const comp = this.services.createComponent<any>(factory);
          comp.instance.values = service;
          comp.instance.parentId = this.pageId;
          comp.instance.parent = "page";
          comp.instance.emitEvent = new EventEmitter();
          comp.instance.emitEvent.subscribe(data => this.catchEvent(data))
        
      });
    }
  }

  catchEvent(data) {
    if (data.userInput) {
    } else {
      this.viewItem(data)
    }
  }

  getTotalValue(service) {
    let total = 0;
    service.data.forEach(item => {
      if (item.type == "item") {
        item.data.forEach(element => {
          if (element.data.defaultName == "quantity") {
            total += parseInt(element.data.text)
          }
        });
      }
    });
    return total
  }

  bookNow() {
    let hasRequired = false;
    let requiredServices= ""
    this.pageServices.forEach((service: any) => {

      if (service.required) {
        const servQuant = this.getTotalValue(service)
        if (servQuant >  0) {
          let hasSelected = false;
          this.booking.selectedServices.forEach(selected => {
            if (selected.serviceGroupId == service._id) {
              hasSelected = true
            }
          })
          if (!hasSelected) {
            requiredServices = requiredServices.includes("|and|")? requiredServices.split("|and|").join(", "): requiredServices
            requiredServices += requiredServices != "" ? "|and|":""
            requiredServices += this.getValue(service.data, "name")
            hasRequired = true;
          }
        }
      }
    })
    if (hasRequired) {
      this.presentAlert(`Please select from ${requiredServices.split("|and|").join(", and ")}.`)
    } else {
      setTimeout(() => {
        this.mainService.canLeave = true;
        let params = { queryParams: {} }
        if (this.isManual) params.queryParams["manual"] = true
        if (this.fromDraft) params.queryParams["draft"] = true
        if (this.editing) params.queryParams["edit"] = true
        if (!this.fromReviewBooking) {
          this.router.navigate(["/service-provider/book", this.pageId, this.booking.bookingType, this.booking._id], params)
        } else {
          this.router.navigate(["/service-provider/booking-review", this.pageId, this.booking.bookingType, this.booking._id], params)
        }
      }, 200);
    }
  }

  viewItem(data) {
    this.mainService.canLeave = true;
    let params = { queryParams: {} }
    if (this.fromDraft) params.queryParams["draft"] = true
    if (this.isManual) params.queryParams["manual"] = true
    if (this.editing) params.queryParams["edit"] = true
    if (this.fromReviewBooking) params.queryParams["fromReviewBooking"] = true
    const itemList = this.pageServices.filter(service => service._id == data.serviceId)
    params.queryParams["inputQuantity"] = itemList[0]["inputQuantity"]
    console.log(params)
    this.router.navigate(["/service-provider/view-item", this.pageId, data.serviceId, data.itemId, this.booking.bookingType, this.booking._id], params)
  }

  changeItem(id) {
    this.mainService.removeSelectedItem(this.booking._id, id).subscribe(
      (response: any) => {
        this.booking.selectedServices = this.booking.selectedServices.filter(item => item._id != id)
        this.checkAvailedServices();
        const serv = this.notSelected.length == 0 ? this.pageServices : this.notSelected
        this.renderServices(serv);
      }
    )
  }

  getValue(components, type) {
    let result = type == "quantity" ? 0 : "Untitled" 
    components.forEach(comp => {
      const data = comp.data
      if (typeof data == "object" && data.defaultName && data.defaultName == type) {
        result = type == "quantity"? parseInt(data.text): data.text
      }
    });
    return result
  }


  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
