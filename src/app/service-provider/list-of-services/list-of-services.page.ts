import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-list-of-services',
  templateUrl: './list-of-services.page.html',
  styleUrls: ['./list-of-services.page.scss'],
})
export class ListOfServicesPage implements OnInit, ViewWillEnter {
  public services: Page[] = []
  public pageId: string;
  public page: any = { otherServices: [] };
  public servicesCategories: any[] = [];
  public categories: any[] = [];
  constructor(public route: ActivatedRoute,
    public router: Router, public mainService: MainServicesService) { }

  // ngOnInit() {
  //   this.route.queryParams.subscribe(
  //     (params: any) => {
  //       this.pageId = params && params.pageId ? params.pageId : ""
  //       this.mainService.getPage(this.pageId).subscribe(
  //         (data: any) => {
  //           this.services = data.otherServices
  //           console.log(this.services)

  //         }
  //       )
  //     }
  //   )
  // }

  
  ionViewWillEnter() {
    this.services = [];
    this.servicesCategories = []
    this.categories = []
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        this.pageId = params && params.pageId ? params.pageId : ""
        this.mainService.getPage(this.pageId).subscribe(
          (data: any) => {
            this.services = data.otherServices
            console.log(this.services)
            this.services.forEach(service => {
              service.components.forEach(com => {
                if (com.data.defaultName && com.data.defaultName == "category") {
                  if (!this.categories.includes(com.data.text)) {
                    this.categories.push(com.data.text);
                  }
                }
              })
            });
            this.categories.forEach(category => {
              let group = []
              this.services.forEach(item => {
                item.components.forEach(data => {
                  if (data.data.defaultName && data.data.defaultName == "category" && data.data.text == category) {
                    group.push(item);
                  }
                })
              })
              this.servicesCategories.push(group);
            })
          }
        )
      }
    )

  }
  viewService(serviceId) {
    this.router.navigate(["/service-provider/view-page", serviceId, "service"])
  }

}
