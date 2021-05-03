import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { user } from "../../services-common-helper/constantValue/user";
import { Router } from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPage implements OnInit {
  public user = {} as user;
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.authService.getUserInfo().subscribe(
      (resp) => {
        this.user = resp;
      },
      (err) => {
        if (err.status == 401) {
          this.authService.logOut();
          this.router.navigate(["/login"]);
        }
      }
    );
  }
}
