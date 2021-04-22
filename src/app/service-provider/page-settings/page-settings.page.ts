import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { MainServicesService } from '../provider-services/main-services.service';
import { popupData } from '../view-booking-as-provider/view-booking-as-provider.page';

@Component({
  selector: 'app-page-settings',
  templateUrl: './page-settings.page.html',
  styleUrls: ['./page-settings.page.scss'],
})
export class PageSettingsPage implements OnInit {
  public pageId: string;
  public page: Page;
  public online: boolean;
  public popupData: popupData;
  constructor(public route: ActivatedRoute,
    public router: Router, public mainService: MainServicesService, public authService: AuthService) {
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }

    this.page = {
      _id: "",
      status: "",
      creator: "",
      pageType: "",
      hostTouristSpot: "",
      components: [],
      services: [],
      otherServices: [],
      bookingInfo: [],initialStatus:"",
      createdAt: null
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: any) => {
        this.pageId = params.get("pageId")
        this.mainService.getPage(this.pageId).subscribe(
          (page: Page) => {

            this.page = page
            this.online = this.page.status == 'Online'
            this.authService.getCurrentUser().then((user: any) => {

              if (page.creator == user._id) {
                if (this.page.creator != user._id) {
                  this.router.navigate(["/service-provider/online-pages-list"])
                }
              }
            })
          }
        )
      }
    )
  }

  changePageStatus(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.popupData = {
        type: 'change_page_status',
        title: this.page.status == "Online" ? `Are you sure you want to set page status to "Not Operating"` : `Are you sure want set the page status to "Online"?`,
        otherInfo: this.page.status == "Online" ? 'The page will no longer be visible online.' : 'The page will be visible online by the tourist and other service providers',
        show: true
      }
    }, 200);
  }

  goTo(path, params) {
    setTimeout(() => {
      this.router.navigate(path, params)
    }, 200);
  }

  editPage() {
    setTimeout(() => {
      const type = this.page.pageType == 'service' ? "create-service-page" : "create-tourist-spot-page";
      this.router.navigate([`/service-provider/${type}`, this.page._id])
    }, 200);
  }

  clicked(action) {
    if (action == "yes") {
      if (this.popupData.type == "change_page_status") {
        let status = this.online ? "Not Operating" : "Online"
        if (this.page.creator == this.mainService.user._id) {
          this.mainService.changePageStatus({ pageId: this.page._id, status }).subscribe(
            (response: any) => {
              this.page.status = status;
              this.online = this.page.status == "Online"
            }
          )
        }
      } else {
      }
    }

    this.popupData.show = false;
  }
}
