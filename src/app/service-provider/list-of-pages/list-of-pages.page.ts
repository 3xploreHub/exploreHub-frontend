import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.page.html',
  styleUrls: ['./list-of-pages.page.scss'],
})
export class ListOfPagesPage implements OnInit {
  public pages: Page[] =[];
  public pagesStatus: string;
  public loading:boolean = true;
  public showOption: boolean = false;
  public pageClicked: string =""
  constructor(
    public creator: PageCreatorService,
    public router: Router,
    public mainService: MainServicesService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public alert: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pagesStatus = params.get('status');
      this.mainService.getPages(this.pagesStatus).subscribe(
        (response: Page[]) => {
          this.pages = response;
          this.loading = false;
        },
        error => {
          this.presentAlert("Unexpected Error Occured!")
          this.router.navigate(['service-provider'])
        }
      )
    })
  }


  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  goToDashBoard(page) {
    this.authService.getCurrentUser().then((user: any) => {
      if (page.creator == user._id) {
        const type = page.hostTouristSpot ? "service" : "tourist_spot"
        const pageTypge = type == 'service' ? "create-service-page" : "create-tourist-spot-page";
        const opts = page.status == "Unfinished" ? { queryParams: { fromDraft: true } } : {}
        setTimeout(() => {
          if (page.status != "Unfinished") {
            this.router.navigate(["/service-provider/dashboard", type, page._id], opts)
          } else {
            this.router.navigate([`/service-provider/${pageTypge}`, page._id], opts)
          }
        }, 200);
      } else {
        alert("not allowed")
      }
    })
  }


  clickOption(id) {
    setTimeout(() => {
      this.pageClicked = id;
      this.showOption = true;
    }, 200);
  }
  clickOpt(type) {
    setTimeout(() => {
      if (type == "delete") {
        this.deletePageConfirm()
      }
      else if (type == "edit") {
        const page = this.pages.filter(item => item._id == this.pageClicked)        
        if (page.length > 0) {
          this.goToDashBoard(page[0])
        }
      }else {
        this.pageClicked = "";
      }
      this.showOption = false;

    }, 100);
  }

  getName(page) {
    let name = "Untitled page"
    page.components.forEach(component => {
      if (component.data.defaultName == "pageName") {
        name = component.data.text
      }
    });
    return name ? name: "Untitled Page";
  }

  async deletePageConfirm() {
    let pageToDelete = this.pages.filter(page => page._id == this.pageClicked);
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: `Are you sure you want to delete "${this.getName(pageToDelete[0])}"?`,
      buttons: [
        {
          text: "Yes",
          handler: () => {
            const page = this.pages.filter(page => page._id == this.pageClicked)
            this.creator.deletePage(this.pageClicked, page[0].pageType).subscribe(
              (response) => {
                this.pages = this.pages.filter(page => page._id != this.pageClicked);
                this.pageClicked = ""
              }
            )
          },
        },
        {
          text: "No",
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
  }

  createPage() {
    setTimeout(() => {
      this.router.navigate(["/service-provider/select-page-type"])
    }, 200);
  }

}
