import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from '../../../modules/elementTools/interfaces/page';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss'],
})
export class PageCardComponent implements OnInit {
  @Input() page: Page;
  @Output() viewPage: EventEmitter<any> = new EventEmitter();
  public pageCreator: string = ''
  public pageCreatorPic: string = ''
  public pagePhoto: string = ''
  public pageTitle: string = ''
  public pageServicesPhotos: string[] = []
  public pageLocation: string = ''
  public pageDescription: string = ''
  constructor() { }

  ngOnInit() {
    if (this.page && this.page.pageType != 'service_group') {
      let location = this.page.components.filter(comp => {
        const dName = comp.data.defaultName;
        return dName == "barangay" || dName == "municipality" || dName == "province"
      })
      location = location.map(data => data.data.text)
      this.pageLocation = location.join(", ")

      this.pageCreator = this.page["pageCreator"][0].fullName
      this.pageCreatorPic = environment.apiUrl+ this.page["pageCreator"][0].profile
      const pageTitle = this.page.components.filter(comp => comp.data.defaultName == "pageName")
      this.pageTitle = pageTitle.length > 0 ? pageTitle[0].data.text : "Untitled Page"

      const photo = this.page.components.filter(comp => comp.type == "photo")
      this.pagePhoto = photo.length > 0 ? photo[0].data[0].url : ""

      const description = this.page.components.filter(comp => comp.data.defaultName == "description")
      this.pageDescription = description.length > 0 ? description[0].data.text : "No Description"
      this.pageDescription = this.pageDescription.length > 350 ? this.pageDescription.substring(0, 350) : this.pageDescription

      this.page.otherServices = this.page["otherServicesData"].map(data => {
        if (data.status == "Online") {
          let pageTitle = data.components.filter(comp => comp.data.defaultName == "pageName")
          data["pageTitle"] = pageTitle.length > 0 ? pageTitle[0].data.text : "Untitled Page"
          
          let photo = data.components.filter(comp => comp.type == "photo")
          data["pagePhoto"] = photo.length > 0 ? photo[0].data[0].url : ""
          return data;
        }
      })
      this.page.otherServices = this.page.otherServices.filter(page => page)

      this.pageServicesPhotos = this.page["pageServices"].map(item => {
        let serv = {}
        if (item.type == "item") {
          item.data.forEach(element => {
            if (element.type == "photo") {
              serv["photo"] = element.data[0].url
            }
            if (element.data.defaultName == "name") {
              serv["name"] = element.data.text
            }
          });
        }
        return serv
      })
      this.pageServicesPhotos = this.pageServicesPhotos.filter((data: any) => data.photo)

      console.log(this.pageServicesPhotos)
    }
  }



  view() {
    setTimeout(() => {
      this.viewPage.emit({ pageId: this.page._id, pageType: this.page.hostTouristSpot ? "service" : "tourist_spot" });
    }, 100);
  }

  shorten(text) {
    return text.length > 500 ? text.substring(0, 500) + "..." : text;
  }
}
