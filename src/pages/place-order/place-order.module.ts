import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceOrderPage } from './place-order';

@NgModule({
  declarations: [
    PlaceOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceOrderPage),
  ],
  exports: [
    PlaceOrderPage
  ]
})
export class PlaceOrderPageModule {}
