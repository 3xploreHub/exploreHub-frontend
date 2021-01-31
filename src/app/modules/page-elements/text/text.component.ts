import { Component, Input, OnInit } from '@angular/core';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  public done: boolean = false;
  public text: string;
  public deleted: boolean = false;
  public saving: boolean = false;

  constructor(public creator: PageCreatorService) { }
  @Input() data: any;
  ngOnInit() {
    console.log(this.data);
    if (this.data) {
      this.done = true;
      this.text = this.data.text;
    }
  }

  renderText() {
    if (this.text) {
      // this.saving = true;
      this.done = true;
      // this.creator.saveComponent().subscribe(
      //   (response) => {
      //     this.done = true;
      //     this.saving = false;
      //   },
      //   (error) => {
      //     this.saving = false;
      //     console.log(error)
      //   }
      // )

    }
  }

  delete() {
    this.deleted = true;
  }

}
