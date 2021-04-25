import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-notification-handler',
  templateUrl: './notification-handler.component.html',
  styleUrls: ['./notification-handler.component.scss'],
})
export class NotificationHandlerComponent {
  public user: any;
  public eventType: string;
  @Output() receiveNotification: EventEmitter<any> = new EventEmitter();
  constructor(private socket: Socket,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public mainService: MainServicesService,
  ) { }


  init(eventType = "") {
    this.eventType = eventType
    this.authService.getCurrentUser().then((user: any) => {
      this.user = user;
      console.log(this.user)
      this.socket.connect();
      this.mainService.socket = this.socket;
      this.mainService.user = this.user
      this.mainService.notify = this.notify
      this.socket.fromEvent('send-notification').subscribe((data: any) => {
        console.log(data);

        if (data.receiver.includes(this.mainService.user._id) || data.receiver.includes("all")) {
          if (data.user._id != this.user._id && !data.receiver.includes("all")) {
            this.showToast(data.message);
          }
          this.mainService.receiveNotification(data)
        }
      });
    })
  }

  disconnect() {
    this.socket.disconnect();
  }

  notify(data) {
    const date = new Date()
    const notifId = "notif"+ date.getHours() + date.getMinutes() + date.getMilliseconds();
    data["notifId"] = notifId
    this.socket.emit('notify', data)
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}
