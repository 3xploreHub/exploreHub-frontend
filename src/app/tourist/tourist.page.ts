import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tourist',
  templateUrl: './tourist.page.html',
  styleUrls: ['./tourist.page.scss'],
})
export class TouristPage implements OnInit {

  // pages=[
  //   {title:" Home Page",url:'tourist/home'},
  //   {title:" Settings Page",url:'tourist/settings'},
  //   // {title:" Home Page",url:'tourist/home'},
  // ]

  selectedPath = ""
  constructor(private authservice:AuthService,private router:Router) {
    // this.router.events.subscribe((event:RouterEvent)=>{
    //   this.selectedPath = event.url;
    // });
   }
  

  ngOnInit() {
  }
  logout() {
    this.authservice.logOut();
    this.router.navigate(["/login"]);
  }

}
