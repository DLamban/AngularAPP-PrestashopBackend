import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DescriptionShort } from './product.description_short';


@NgModule({
  declarations: [
    DescriptionShort
  ],
  imports: [
    IonicPageModule.forChild(DescriptionShort),
  ],
  exports: [
    DescriptionShort
  ],
  bootstrap:[ DescriptionShort]

})
export class DescriptionShortModule {}
