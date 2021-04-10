import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { EditAccountInfoPage } from './edit-account-info/edit-account-info.page';
import { ChangePasswordPage } from '../../change-password/change-password.page';

import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  imports: [
CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    IonicStorageModule,
    ReactiveFormsModule
  ],
  declarations: [
    SettingsPage,
    EditAccountInfoPage,
    ChangePasswordPage
  ],
  providers: [
    Camera, 
    File, 
    WebView, 
    Storage,
    FilePath
  ]
})
export class SettingsPageModule {}
