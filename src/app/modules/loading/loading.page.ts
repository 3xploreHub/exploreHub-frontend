import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../services-common-helper/loadingService/loading-service.service";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.page.html",
  styleUrls: ["./loading.page.scss"],
})
export class LoadingPage implements OnInit {
  public isLoading = false;
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });
  }
}
