import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  public pagePhoto: string = ''
  public pageTitle: string = ''
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
      const pageTitle = this.page.components.filter(comp => comp.data.defaultName == "pageName")
      this.pageTitle = pageTitle.length > 0? pageTitle[0].data.text: "Untitled Page"

      const photo = this.page.components.filter(comp => comp.type == "photo")
      this.pagePhoto = photo.length > 0? photo[0].data[0].url: ""
      console.log(this.pagePhoto);
      
      console.log(photo);
      

      const description = this.page.components.filter(comp => comp.data.defaultName == "description")
      this.pageDescription = description.length > 0? description[0].data.text: "No Description"
    }
  }

  view() {
    setTimeout(() => {
      this.viewPage.emit({pageId:this.page._id, pageType: this.page.hostTouristSpot? "service": "tourist_spot"});
    }, 100);
  }

  shorten(text) {
    return text.length > 400 ? text.substring(0,400)+ "...": text;
  }
}
