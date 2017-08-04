import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckCartPage } from './check-cart';

@NgModule({
  declarations: [
    CheckCartPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckCartPage),
  ],
  exports: [
    CheckCartPage
  ]
})
export class CheckCartPageModule {}
