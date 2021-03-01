import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-slide-view',
  templateUrl: './photo-slide-view.component.html',
  styleUrls: ['./photo-slide-view.component.scss'],
})
export class PhotoSlideViewComponent implements OnInit {
  @Input() images: any[] = [];
  @Input() parent: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor() { }

  ngOnInit() {
   }

}
