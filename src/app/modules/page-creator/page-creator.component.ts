import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem } from '@capacitor/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';
import { TextComponent } from 'src/app/modules/page-elements/text/text.component';
import { ElementComponent } from '../elementTools/interfaces/element-component';
import { TouristSpotPage } from '../elementTools/interfaces/tourist-spot-page';
import { PageElementListComponent } from '../page-element-list/page-element-list.component';
import { BulletFormTextComponent } from '../page-elements/bullet-form-text/bullet-form-text.component';
import { LabelledTextComponent } from '../page-elements/labelled-text/labelled-text.component';
import { PageInputFieldListComponent } from '../page-input-field-list/page-input-field-list.component';
import { ChoicesInputComponent } from '../page-input-field/choices-input/choices-input.component';
import { DateInputComponent } from '../page-input-field/date-input/date-input.component';
import { NumberInputComponent } from '../page-input-field/number-input/number-input.component';
import { TextInputComponent } from '../page-input-field/text-input/text-input.component';
import { PageServicesListComponent } from '../page-services-list/page-services-list.component';
import { ItemListComponent } from '../page-services/item-list/item-list.component';
import { PageCreatorService } from './page-creator-service/page-creator.service';

@Component({
  selector: 'app-page-creator',
  templateUrl: './page-creator.component.html',
  styleUrls: ['./page-creator.component.scss'],
})

export class PageCreatorComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  // @HostListener('window:scroll', ['$event'])
  public page: TouristSpotPage;
  public preview: boolean = false;
  public loading: boolean = false;
  public showUnfilled: boolean = false;
  public unfilledFields = { components: [], services: [], bookingInfo: [] }

  boxPosition: number;
  components = {
    'text': TextComponent,
    'bullet-form-text': BulletFormTextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
    'item-list': ItemListComponent,
    'text-input': TextInputComponent,
    'number-input': NumberInputComponent,
    'date-input': DateInputComponent,
    'choices-input': ChoicesInputComponent
  }

  constructor(public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public alert: AlertController,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  setPage(page) {
    this.creator.canLeave = false;
    this.page = page;
    this.creator.currentPageId = this.page._id;
    this.page.components.forEach((component: any) => {
      this.renderComponent(this.pageElement, component, "page")
    })
    this.page.services.forEach((component: any) => {
      this.renderComponent(this.pageService, component, "page")
    })

    this.page.bookingInfo.forEach((component: any) => {
      this.renderComponent(this.pageInputField, component, "page_booking_info")
    })
  }

  onScroll(event, info: HTMLElement, services: HTMLElement, div: HTMLElement) {

    const width = div.clientWidth;

    const scrolled = event.detail.scrollTop;

    if (info.clientHeight >= scrolled) {
      this.boxPosition = 0;
    }
    if (info.clientHeight < scrolled) {
      this.boxPosition = width;
    }
    if ((info.clientHeight + services.clientHeight) < scrolled) {
      this.boxPosition = width * 2;
    }


  }

  showComponentList() {
    return this.showModal(this.pageElement, PageElementListComponent, "page");
  }

  showServicesComponentList() {
    return this.showModal(this.pageService, PageServicesListComponent, "page");
  }

  showInputFieldList() {
    return this.showModal(this.pageInputField, PageInputFieldListComponent, "page_booking_info");
  }

  async showModal(type: ViewContainerRef, List: any, parent: string) {
    const modal = await this.modalController.create({
      component: List,
      cssClass: 'componentListModal'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(type, { type: data, unSaved: true }, parent);

    return present;
  }

  scroll(el: HTMLElement, tab: string, div: HTMLElement) {
    const width = div.clientWidth;
    switch (tab) {
      case 'booking':
        this.boxPosition = width * 2;
        break;
      case 'services':
        this.boxPosition = width;
        break;
      default:
        this.boxPosition = 0
        break;
    }
    el.scrollIntoView();
  }

  renderComponent(type: ViewContainerRef, componentValues: any, parent) {
    if (componentValues.type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = type.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.page._id;
      comp.instance.parent = parent;
    }
  }

  exit() {
    this.router.navigate(['/service-provider'])
  }

  previewPage() {
    let valid = [];
    this.unfilledFields = { components: [], services: [], bookingInfo: [] }
    this.loading = true;
    setTimeout(() => {
      this.creator.retrieveToristSpotPage(this.page._id).subscribe(
        (response: TouristSpotPage) => {
          this.page = response;
          console.log(response);

          //check components
          const checkingResult = this.creator.checkIfHasValue(this.page.components)
          if (!checkingResult) {
            valid.push(checkingResult)
            this.getUnfilledFields();
          }

          //check services

          if (this.page.services.length > 0) {
            this.page.services.forEach(item_list => {
              if (item_list.data.length == 1) {
                valid.push(false)
                this.getUnfilledFields()
              } else {
                item_list.data.forEach(item => {
                  let data = item.data;
                  if (item.type != "item") {
                    data = [item]
                  }
                  valid.push(this.creator.checkIfHasValue(data, true))
                  this.getUnfilledFields()
                });
              }
            })
          }

          //check bookinginfo input fields
          if (this.page.bookingInfo.length > 0) {
            const result = this.creator.checkIfHasValue(this.page.bookingInfo)
            if (!result) {
              valid.push(result)
              this.getUnfilledFields()
            }
          }
          valid = valid.filter(i => !i);

          let fields = { components: [], services: [], bookingInfo: [] }

          fields.components = this.countFields(this.unfilledFields.components);
          fields.services = this.countFields(this.unfilledFields.services);
          fields.bookingInfo = this.countFields(this.unfilledFields.bookingInfo);

          this.unfilledFields = fields;

          if (valid.length > 0) {
            this.creator.preview = false;
            this.showUnfilled = true;

          } else {
            this.creator.preview = true;
          }

          this.loading = false;
        },
        (error) => {
          if (error.status == 404) {
            this.router.navigate(["/service-provider"])
          }
        })
    }, 500);


  }

  getUnfilledFields() {
    this.unfilledFields = {
      components: [...this.unfilledFields.components, ...this.creator.unfilledFields.components],
      services: [...this.unfilledFields.services, ...this.creator.unfilledFields.services],
      bookingInfo: [...this.unfilledFields.bookingInfo, ...this.creator.unfilledFields.bookingInfo],
    }
  }

  countFields(list) {
    let fields = []
    let finalList = []
    list.forEach(f => {
      if (!fields.includes(f)) {
        let count = 0;
        list.forEach(i => {
          if (f == i) {
            count++
          }
        })
        fields.push(f);
        finalList.push(`${f} (${count})`);
      }
    })
    return finalList;
  }
  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
