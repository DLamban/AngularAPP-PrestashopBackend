import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import { BrowserModule } from '@angular/platform-browser';
//custom directive
import { RewriteLinkDirective } from './product.directive';

@NgModule({
  declarations: [
    ProductPage,
    RewriteLinkDirective
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    BrowserModule
  ],
  exports: [
    ProductPage
  ],
  bootstrap:[ ProductPage]

})
export class ProductPageModule {}
