import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';

@Component({
  selector: 'app-group-of-services',
  templateUrl: './group-of-services.component.html',
  styleUrls: ['./group-of-services.component.scss'],
})
export class GroupOfServicesComponent implements OnInit {
  @Input() services: any[] = []

  @Input() data: Page;
  @Input() oldPageName: string = ""
  @Input() location: string = ""
  constructor(public router: Router) { 

  }

  ngOnInit() {
    let address = this.data.components.filter(data => data.data.defaultName == "pageName")
    this.oldPageName = address.length > 0? address[0].data.text: "Untitled Page"
    let location = this.data.components.filter(data => data.data.defaultName == "location")
    if (location.length == 1) {
      this.location = location[0].data.text
    } else {
      location = this.data.components.map(data => {
        const name = data.data.defaultName
        if (name == "barangay" || name == "municipality" || name == "province") {
          return data.data.text
        }
      })
      location = location.filter(loc => loc)
      this.location = location.join(", ")
    }
    this.services = this.data["otherServicesData"]? this.data["otherServicesData"]: this.data.otherServices
  }

  viewService(id) {
    this.router.navigate(["/service-provider/view-page", id, "service"])
  }

  viewAll() {
    this.router.navigate(["/service-provider/list-of-services"],{queryParams: {pageId: this.data._id}})
  }
}
