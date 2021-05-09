import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-option-popup',
  templateUrl: './option-popup.component.html',
  styleUrls: ['./option-popup.component.scss'],
})
export class OptionPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() cantDelete: boolean = false
  @Output() clickOpt: EventEmitter<any> = new EventEmitter();
  constructor(public toast: ToastController) { }

  ngOnInit() {}

  clickOption(e, type) {
    e.stopPropagation()
    setTimeout(() => {
      
      if (type == "delete") {
        if (!this.cantDelete) {
          this.clickOpt.emit("delete")
        } else {
          this.presentToast("Cancel the booking first to be able to delete it.")
        }
      }
      else if (type == "edit") {
        this.clickOpt.emit("edit")
      }else {
        this.show = false
        this.clickOpt.emit("close")
      }
    }, 100);
  }

  clickBox(e) {
    e.stopPropagation();
    this.clickOpt.emit("close")
    this.show = false;
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
