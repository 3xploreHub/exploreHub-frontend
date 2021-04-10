import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-notification-handler',
  templateUrl: './notification-handler.component.html',
  styleUrls: ['./notification-handler.component.scss'],
})
export class NotificationHandlerComponent implements OnInit {
  public user: any;
  constructor(private socket: Socket,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public mainService: MainServicesService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.authService.getCurrentUser().then((user: any) => {
      this.user = user;

      this.socket.connect();

      this.socket.fromEvent('send-notification').subscribe((data: any) => {
        if (data.receiver == this.user._id) {
          if (data.user._id != this.user._id) {
            this.showToast(data.message);
          }
          this.mainService.receiveNotification(data)
        }
      });
    })
  }

  notify(data) {
    data["user"] = this.user;
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
