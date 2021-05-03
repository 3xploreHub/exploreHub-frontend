
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const Pusher: any;
@Injectable()
export class PusherService {
  // private pusher_key = environment.pusher_key;
  // private cluster = environment.cluster;
  // pusher;
  // channel;

  // constructor(public http: HttpClient) {
  //   this.pusher = new Pusher(this.pusher_key, {
  //     cluster: this.cluster,
  //     encrypted: true,
  //   });
  // }

  // public init(channelName) {
  //   this.channel = this.pusher.subscribe(channelName);
  //   return this.channel;
  // }

  // public unSubscribe(channelName) {
  //   this.pusher.unsubscribe(channelName);
  // }
}