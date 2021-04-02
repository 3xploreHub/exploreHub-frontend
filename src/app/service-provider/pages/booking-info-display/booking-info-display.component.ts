import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { InputValue } from 'src/app/modules/elementTools/interfaces/InputValues';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from 'src/app/modules/page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-booking-info-display',
  templateUrl: './booking-info-display.component.html',
  styleUrls: ['./booking-info-display.component.scss'],
})
export class BookingInfoDisplayComponent implements OnInit {
  @Input() inputValues: InputValue[] = []
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  public components: any = {
    'bullet-form-text-display': BulletFormTextDisplayComponent,
    'labelled-text-display': LabelledTextDisplayComponent,
  }
  constructor(public mainService: MainServicesService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public route: ActivatedRoute,
    public router: Router,
    public creator: PageCreatorService) { }

  ngOnInit() {
  }


  makeComponent(value) {
    let component;
    if (value.settings && value.settings.multiple) {
      component = { _id: "", type: "bullet-form-text", styles: [], data: { label: value.inputLabel, list: value.value } };
    } else {
      component =  { _id: "", type: "labelled-text", styles: [], data: { label: value.inputLabel, text: value.value } };
    }
    return component
  }

}
