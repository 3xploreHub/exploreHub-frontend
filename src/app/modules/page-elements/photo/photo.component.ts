import { Component, OnInit, ɵ_sanitizeUrl } from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {
  public previewImage: string;
  constructor() { }

  ngOnInit() {}

  loadImageFromDevice(event) {

    const file = event.target.files[0];
  
    const reader = new FileReader();
  
    reader.readAsArrayBuffer(file);
  
    reader.onload = () => {
  
      // get the blob of the image:
      let blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
  
      // create blobURL, such that we could use it in an image element:
      this.previewImage = URL.createObjectURL(blob);
      console.log('image ', ɵ_sanitizeUrl(this.previewImage))
    };
  
    reader.onerror = (error) => {
  
      //handle errors
      console.log(error);
  
    };
  };

}
