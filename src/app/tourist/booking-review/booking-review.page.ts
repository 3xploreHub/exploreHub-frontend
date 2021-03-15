import { Component, OnInit} from '@angular/core';
import {booking} from '../data/data'
@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.page.html',
  styleUrls: ['./booking-review.page.scss'],
})
export class BookingReviewPage implements OnInit {


  constructor() { }
  ngOnInit() {
  }


  // handleSubmit(){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You want to submit this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire(
  //         'Successfully sent!',
  //         'Kindly wait for the response which will appear in your notification',
  //         'success'
  //       )
  //     }
  //   })
  // }

}
