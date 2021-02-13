import { Component, Output, OnInit, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-edit-or-delete-popup',
  templateUrl: './edit-or-delete-popup.component.html',
  styleUrls: ['./edit-or-delete-popup.component.scss'],
})
export class EditOrDeletePopupComponent implements OnInit {
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() deleting: boolean = false;
  @Input() isDefault: boolean = false;
  delClicked = false;

  constructor() { }

  ngOnInit() {}

}
