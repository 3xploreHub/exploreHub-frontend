import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.page.html',
  styleUrls: ['./view-item.page.scss'],
})
export class ViewItemPage implements OnInit {
  public values: ElementValues;
  public serviceId: string;
  public itemId: string;
  public pageId: string;
  name = ""
  start = false;
  end = false;
  public notOperating: boolean = false
  public bookingId: string;
  public inputQuantity: boolean = false
  item: any;
  noAvailable = false;
  public serviceGroupName: string;
  public pageType: string;
  @ViewChild('slides', { static: false }) slides: IonSlides;
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) {
    this.values = { _id: "", type: "item-list", styles: [], data: [], default: false }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param: any) => {
      if (param) {
        if (param.notOperating) this.notOperating = true
        if (param.inputQuantity == "true") this.inputQuantity = true
      }
    })
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('serviceId');
      this.itemId = params.get('itemId');
      this.pageId = params.get('pageId');
      this.pageType = params.get("pageType");
      this.bookingId = params.get("bookingId");
      this.mainService.viewItems({ pageId: this.pageId, serviceId: this.serviceId, pageType: this.pageType }).subscribe(
        (response: any) => {
          this.values.data = response;
          this.values.data = this.values.data.map((item: any) => {
            let available = 0;
            if (item.type == "item") {
              item.data = item.data.map(component => {
                if (component.data.defaultName == "quantity") {
                  component.data.label = "Available"
                  const booked = (item["booked"] + item["manuallyBooked"] + item["toBeBooked"] + item["pending"])

                  available = component.data.text - booked
                  available = available == null || available == NaN ? 0 : available
                  if (available == 0) {
                    item["noAvailable"] = true
                  }
                  item["inputQuantity"] = this.inputQuantity
                  component.data.text = available
                }
                return component
              })
            } else {
              if (item.data.defaultName == "name") {
                this.name = item.data.text
              }
            }
            return item
          });

          console.log(this.values.data)
          this.values.data = this.values.data.filter(item => item.type == "item")
          for (let i = 0; i < this.values.data.length; i++) {
            const element = this.values.data[i];
            if (element._id == this.itemId) {
              this.slides.slideTo(i, 500);
            }

          }


          response.forEach(item => {

            if (item.type == "text") {
              if (item.data.defaultName && item.data.defaultName == "name") {
                this.serviceGroupName = item.data.text;

              }
            }
          });

        },
        err => {

        }
      )
    })
  }


  slideChanged() {
    this.slides.getActiveIndex().then(id => {
      this.start = id == 0;
      this.end = id == this.values.data.length - 1
    });
  }
}
