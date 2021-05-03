import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { SelectedService } from '../../provider-services/interfaces/selectedService';

@Component({
  selector: 'app-selected-service-card',
  templateUrl: './selected-service-card.component.html',
  styleUrls: ['./selected-service-card.component.scss', "../select-service/select-service.page.scss"],
})
export class SelectedServiceCardComponent implements OnInit {
  @Input() item: SelectedService;
  @Input() editable: boolean = true;
  @Output() changeItem: EventEmitter<any> = new EventEmitter();
  constructor() {
    this.item = {
      _id: "",
      service: "",
      serviceGroupName: "",
      serviceGroupId: "",
      otherData: null
    }
  }

  ngOnInit() {
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

  getPhoto(data) {
    let photo;
    if (data && data.data) {

      data.data.forEach(comp => {
        if (comp.type == "photo") {
          photo = comp.data.length > 0 ? comp.data[0].url : "";
        }
      });
    }
    return photo;
  }
  getServiceName(data, defaultName) {
    let name;
    if (data && data.data) {

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
    }
    return name;
  }
  changeService() {
    this.changeItem.emit(this.item._id);
  }
}
