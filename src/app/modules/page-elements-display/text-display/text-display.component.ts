import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss'],
})
export class TextDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parent: string;
  constructor() { }

  ngOnInit() {
    if (this.parent && this.parent == "component") {
    
      this.values.styles.push("onItemStyle")
    } else {
      this.values.styles = this.values.styles.filter(style => style != "onItemStyle")
    }
    
  }


}
