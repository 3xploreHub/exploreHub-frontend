import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../services-common-helper/loadingService/loading-service.service";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.page.html",
  styleUrls: ["./loading.page.scss"],
})
export class LoadingPage implements OnInit {
  public isLoading = false;
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {
    console.log("LOADING INDICATOR");
    this.loadingService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        console.log("at loading");
        this.isLoading = true;
      } else {
        console.log("At close loading");
        this.isLoading = false;
      }
    });
  }
}
