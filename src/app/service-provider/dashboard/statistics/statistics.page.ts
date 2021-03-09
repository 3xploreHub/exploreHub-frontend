import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  public services: ElementValues[];
  public pageId: string;
  public pageType: string;
  public scrollList: boolean = false;
  public itemClicked: boolean;
  constructor(public mainService: MainServicesService, public router: Router) { }

  ngOnInit() {
    const url = this.router.url.split('/').reverse();
    this.mainService.getServices(url[2], url[3]).subscribe(
      (response: Page) => {
        this.services = response.services;
      },

    )
  }

  getItemName(item) {
    const name = item.data.filter(comp => comp.data.defaultName == 'name')
    return name.length > 0 && name[0].data.text ? name[0].data.text : 'Untitled';
  }

  filterItem(data) {
    return data.filter(item => item.type == "item")
  }

  getValue(data, type, format=true) {
    const quantity = data.filter(comp => comp.data.defaultName == type);
    return quantity.length > 0 ? format ? this.formatNumber(quantity[0].data.text):quantity[0].data.text : type == 'price' ? 'none' : 'Unli.'
  }

  formatNumber(data) {
    let m = data.toString();
    let val = m.includes(".") ? "." + m.split(".")[1] : ""
    m = m.includes(".") ? m.split(".")[0] : m
    m = m.split("").reverse().join("")
    let num = "";
    for (let i = 0; i < m.length; i++) {
      let n = (i + 1) % 3 == 0 ? i == m.length - 1 ? m[i] : m[i] + "," : m[i]
      num += n;
    }
    val = num.split("").reverse().join("") + val;
    return val;
  }

  countServices(service) {
    let count = 0;
    service.data.forEach(element => {
      count += element.type == "item" ? 1 : 0;
    });
    return count;
  }

  getTotalQuantity(item_list) {
    let result = 0;
      item_list.data.forEach(item => {
        if (item.type == "item") {
          const res = this.getValue(item.data, "quantity", false)
          if (res != 'none' && res != 'Unli.') {
            result += Number(res);
          }
        }
      });
    return result;
  }

  clickOutside(e) {
    e.stopPropagation();
    this.itemClicked = null
  }

  clickItem(e) {
    e.stopPropagation();
  }
}
