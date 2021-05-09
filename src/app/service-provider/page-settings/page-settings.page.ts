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
  public cannotDeleted: boolean = false
  public online: boolean;
  public password: string;
  public confirmDelete: boolean;
  public showOtherServicesGroup: boolean;
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
      bookingInfo: [], initialStatus: "",
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

  getName() {
    const component = this.page.components.filter(comp => comp.data.defaultName == "pageName")
    return component.length > 0 ? component[0].data.text : "Untitled Page"
  }

  changePageStatus(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.popupData = {
        type: 'change_page_status',
        title: this.page.status == "Online" ? `Are you sure you want to set page status to <b>Not Operating</b>` : `Are you sure want set the page status to <b>Online</b>?`,
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
    console.log(action);

    if (action == "yes") {
      if (this.popupData.type == "change_page_status") {
        let status = this.online ? "Not Operating" : "Online"
        if (this.page.creator == this.mainService.user._id) {
          this.mainService.changePageStatus({ pageId: this.page._id, status }).subscribe(
            (response: any) => {
              this.page.status = status;
              this.online = this.page.status == "Online"
              this.mainService.notify({ user: this.mainService.user, receiver: ["admin", "all"], pageId: this.page._id, status: status, type: "page-status-edit", message: `${this.mainService.user.fullName} change his page status` })
            }
          )
        }
      } else {
        this.confirmDelete = !this.cannotDeleted;
      }
    }

    this.popupData.show = false;
  }

  deleteConfirmedPage() {
    if (this.password && this.password.trim()) {

      this.confirmDelete = false
      this.mainService.deleteConfirmedPage({ pageId: this.pageId, pageType: this.page.pageType, requiredPassword: true, password: this.password, otherServices: this.page.otherServices }).subscribe(
        (response: any) => {
          this.router.navigate(["/service-provider/list-of-pages", "submitted"])
        },
        (error: any) => {
          this.password = ""
          if (error.status == 400 && error.error.type == "incorrect_password") {

            this.popupData = {
              type: "info",
              title: "The password you have entered is incorrect.",
              otherInfo: "Please try again",
              show: true
            }
          }
        }
      )
    }
  }

  hideServiceGroupToBeCreated() {
    setTimeout(() => {
      this.showOtherServicesGroup = false;
    }, 300);
  }

  cancelDelete() {
    setTimeout(() => {
      this.confirmDelete = false
      this.showOtherServicesGroup = false;

    }, 300);
  }

  continueDeleting() {
    setTimeout(() => {
      this.popupData = {
        type: 'delete_page',
        title: `Are you sure you want to delete <b>${this.getName()}</b>?`,
        otherInfo: '<b>This action cannot be undone</b>. Deleted page can never be restored.',
        show: true
      }
    }, 300);
  }

  toDeletePage(e) {
    e.stopPropagation()
    this.mainService.getPageActiveBookings(this.pageId).subscribe(
      (response: any) => {
        if (response.bookings.length > 0) {
          const processing = response.bookings.filter(booking => booking.status == "Processing")
          const booked = response.bookings.filter(booking => booking.status == "Booked")
          let message = processing.length > 0 ? `${processing.length} ${processing.length > 1 ? 'bookings are' : 'booking is'} in process` : ""
          let message2 = booked.length > 0 ? `${booked.length} ${booked.length > 1 ? 'bookings are' : 'booking is'} ongoing` : ""
          const text = message + (message != "" ? (message2 != "" ? ", and " + message2 : "") : message2)
          this.cannotDeleted = true
          this.popupData = {
            type: "info",
            title: "Cannot delete page with active bookings.",
            otherInfo: text,
            show: true
          }
        } else {
          if (this.page.otherServices.length > 0) {
            this.showOtherServicesGroup = true;
          } else {
            this.popupData = {
              type: 'delete_page',
              title: `Are you sure you want to delete <b>${this.getName()}</b>?`,
              otherInfo: '<b>This action cannot be undone</b>. Deleted page can never be restored.',
              show: true
            }
          }
        }
      }
    )
  }
}
