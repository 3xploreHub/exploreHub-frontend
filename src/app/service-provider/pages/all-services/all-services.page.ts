import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.page.html',
  styleUrls: ['./all-services.page.scss'],
})
export class AllServicesPage implements OnInit, ViewWillEnter {
  public services: Page[] = []
  public servicesCategories: any[] = [];
  public categories: any[] = [];

  constructor(public router: Router, public route: ActivatedRoute, public mainService: MainServicesService) {
    this.servicesCategories = []
    this.categories = []
   }
  ionViewWillEnter() {
    this.services = [];
    this.servicesCategories = []
    this.categories = []
   }
  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('hostId');
      this.mainService.viewAllServices(id).subscribe(
        (response: Page[]) => {
          this.services = response;
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
    })
  }
  viewService(serviceId) {
    this.router.navigate(["/service-provider/view-page", serviceId, "service"])
  }

}
