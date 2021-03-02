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
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.images) {
        if (this.slides) {
          let d = 1;
          let count = 0;
          setInterval(() => {
            console.log(count);
            
            this.slides.slideTo(count += d, 1800);
            if (count == this.images.length || count < 1) {
              d = -d;
            }
          }, 3000)
        }
      }
    }, 500);
  }

  start() {
    let count = 0;
    setInterval(function () {
      console.log(count);

      this.slides.slideTo(count++, 1500);
      if (count == this.images.length) {
        count = 0;
      }
    }, 1000)

  }

}
