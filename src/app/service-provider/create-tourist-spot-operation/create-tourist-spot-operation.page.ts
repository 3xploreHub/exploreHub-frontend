import { Component, OnInit, ViewChild } from '@angular/core';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';

@Component({
  selector: 'app-create-tourist-spot-operation',
  templateUrl: './create-tourist-spot-operation.page.html',
  styleUrls: ['./create-tourist-spot-operation.page.scss'],
})
export class CreateTouristSpotOperationPage implements OnInit {
  @ViewChild(PageCreatorComponent)
  public codeHandler: PageCreatorComponent;

  constructor() { }

  ngOnInit() {
  }

}
