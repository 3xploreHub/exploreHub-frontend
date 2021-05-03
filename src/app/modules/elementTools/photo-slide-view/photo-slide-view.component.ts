import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-photo-slide-view',
  templateUrl: './photo-slide-view.component.html',
  styleUrls: ['./photo-slide-view.component.scss'],
})
export class PhotoSlideViewComponent implements OnInit, AfterViewInit {
  @Input() images: any[] = [];
  @Input() parent: string;
  @ViewChild('slides' , {static: false}) slides: IonSlides;
  forward = true;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.images) {
        if (this.slides) {
          setInterval(() => {
            if (this.forward) {
            this.slides.slideNext(1800);
            } else {
              this.slides.slidePrev(1800);
            }
          }, 3000)
        }
      }
    }, 500);
  }

}
