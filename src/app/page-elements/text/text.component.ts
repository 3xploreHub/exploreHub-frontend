import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  public done: boolean = false;
  public text: string;
  public delted: boolean = false;
  public delClicked: boolean = false;

  constructor() { }

  ngOnInit() { }

  renderText() {
    if (this.text) {
      this.done = true;
    }
  }

}
