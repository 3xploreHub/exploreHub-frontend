import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth-services/auth-service.service";
import { Router } from "@angular/router";
import { user } from "../services-common-helper/constantValue/user";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  user = {} as user;
  name: string;

  constructor(public authservice: AuthService, public router: Router) {}

  ngOnInit() {
    this.authservice.getUserInfo().subscribe(
      (resp) => {
        // resp.subscribe(res => {
        console.log("at home  ", resp);
        this.user = resp;
        this.name = this.user.fullName;
      },
      (err) => {
        if (err.status == 401) {
          this.authservice.logOut();
          this.router.navigate(["/login"]);
        }
        console.log("error in repsond", err);
      }
    );
  }

  logout() {
    this.authservice.logOut();
    this.router.navigate(["/login"]);
  }
}
