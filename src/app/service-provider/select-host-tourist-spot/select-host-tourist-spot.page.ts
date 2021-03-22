import { Component, OnInit } from "@angular/core";
// import { TouristSpotPage } from "src/app/modules/interfaces/tourist-spot-page";
import { SelectHostTouristSpotService } from "./select-host-tourist-spot.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PageCreatorService } from "src/app/modules/page-creator/page-creator-service/page-creator.service";
import { Page } from "src/app/modules/elementTools/interfaces/page";
import { ElementValues } from "src/app/modules/elementTools/interfaces/ElementValues";
import { AlertController } from "@ionic/angular";

interface Spot {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  description: string;
  image: string;
  location: string;
  selected: boolean;
}

interface SpotCategory {
  _id: string;
  name: string;
  touristSpotTotalCount: number;
}

@Component({
  selector: "app-select-host-tourist-spot",
  templateUrl: "./select-host-tourist-spot.page.html",
  styleUrls: ["./select-host-tourist-spot.page.scss"],
})

export class SelectHostTouristSpotPage implements OnInit {
  touristSpotPages: Page[] = [];
  selectedPage:Page;
  keyupValues = "";

  sampleCategory;

  constructor(
    private router: Router,
    private creator: PageCreatorService,
    public alert: AlertController,
    private selectHostTouristSpotService: SelectHostTouristSpotService
  ) {}

  spotsListCategory: Spot[] = [];
  selectedSpots: Spot[] = [];
  yourHostSpot: Spot;
  spotsLocation = [];
  allSpotsName = [];
  show = false;
  buttonSelectWord = "Select";
  searchInput: string;
  
  ngOnInit() {
    this.retrieveAllTouristSpotsPage();
  }

  retrieveAllTouristSpotsPage() {
    this.creator.retrieveAllTouristSpotsPage().subscribe(
      (response: Page[]) => {
        this.touristSpotPages = response;
      },
      error => {
        
      }
    )
  }

  onKey(event: any) { // without type info
    this.keyupValues += event.target.value + ' | ';
  }

  showDetails(spot: any) {
    this.yourHostSpot = spot;
    this.show = true;
  }

  selectTouristSpot() {
    this.selectedSpots = [];
    if(!this.selectedSpots.includes(this.yourHostSpot)) {
      this.selectedSpots.push(this.yourHostSpot);
    }else{
    }
      this.show = false;
  }

  submitSelectedHostSpot() {
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
  }

  cancelSelectedHostSpot() {
    this.selectedSpots = [];
  }


  getAllSpotsBasedOnSearch() {}

  createServicePage() {
    let hostTouristSpot = {_id: this.selectedPage._id, municipality: this.selectedPage.components[3].data.text, city: this.selectedPage.components[4].data.text}
    this.creator.createPage("service",hostTouristSpot).subscribe(
      (response: any) => {
        this.router.navigate(["/service-provider/create-service-page", response._id])
      },
      error => {
        this.presentAlert("An error occured! Please try again later.")
      }
    )
  }


  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  
  shorten(text) {
    if (!text) {
      return "Unititled"
    }
    return text.length > 50 ? text.substring(0,50)+ "...": text;
  }
}
