import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
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
export class SelectServicePage implements  AfterViewInit, ViewWillEnter {
  public booking: bookingData;
  public pageId: string;
  public pageServices: ElementValues[];
  @ViewChild('services', { read: ViewContainerRef }) services: ViewContainerRef;
  public selected: any[] = []
  public notSelected: ElementValues[] = []
  constructor(public componentFactoryResolver: ComponentFactoryResolver, public router: Router, public route: ActivatedRoute, public mainService: MainServicesService) { }

  ionViewWillEnter() {
    this.selected = [];
    this.notSelected = []
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(params => {
      const bookingId = params.get("bookingId")
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

  getServiceName(data, defaultName) {
    let name;
    data.data.forEach(component => {
      if (component.data.defaultName && component.data.defaultName == defaultName) {
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
      this.booking.selectedServices.forEach((item: any) => {
        if (item.serviceGroupId == itemList._id) {
          selected = true;
          let selectedItem = { groupName: this.getServiceName(itemList, "name"), serviceName: item.serviceName }
          itemList.data.forEach(service => {
            if (service._id == item.serviceId) {
              selectedItem["service"] = service;
              this.selected.push(selectedItem);
            }
          });
        }
      })
      if (!selected) {
        this.notSelected.push(itemList);
      }
    });
  }

  renderServices(services) {
    this.services.clear();
    if (this.services) {
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

  bookNow() {
    setTimeout(() => {
      
      this.router.navigate(["/service-provider/book", this.pageId,this.booking.bookingType, this.booking._id])
    }, 200);
  }

  viewItem(data) {
    this.router.navigate(["/service-provider/view-item", this.pageId, data.serviceId, data.itemId, this.booking.bookingType, this.booking._id])
  }
}
