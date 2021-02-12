import { Component, Input, OnInit } from '@angular/core';
import { Element } from '../../interfaces/Element';

@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss'],
})
export class TextDisplayComponent implements OnInit {
  @Input() values: Element;
  constrtuctor() { }

  ngOnInit() {}

}
