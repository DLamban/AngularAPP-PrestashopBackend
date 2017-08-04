import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Settings} from "../../providers/settings";
import {CartService} from "../cart/cart.service";
import {Http} from "@angular/http";
import {Order} from "../../models/order";
import {MainPage} from "../pages";

/**
 * Generated class for the PlaceOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-place-order',
  templateUrl: 'place-order.html',
})
export class PlaceOrderPage {
  private products:any;
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settings:Settings,
              private cartServ:CartService,
              private http:Http,
              private order:Order) {




  }
  finishOrder(){
    this.order.createOrderAttr();

    //setroot main page, should erase things,add a toast main page
    this.navCtrl.setRoot(MainPage);
  }
  /**
   * order rows are compound by:
   *
   * <order_row>
         <id>1500</id>
         <product_id>131</product_id>
         <product_attribute_id>3801</product_attribute_id>
         <product_quantity>2</product_quantity>
         <product_name>5200 - Elige color : Negro</product_name>
         <product_reference/>
         <product_ean13/>
         <product_upc/>
         <product_price>33.000000</product_price>
         <unit_price_tax_incl>23.958000</unit_price_tax_incl>
         <unit_price_tax_excl>19.800000</unit_price_tax_excl>
   * </order_row>
   *
   * What means: { id:automatic, product_id:number, product_attribute:number,
   *              product_quantity:number, product_name:string, product_price:number,
   *              unit_price_tac_incl:number,unit_price_tac_excl:number}
   *
   * return observable with product because we need to call the api to get all the values
   */


}
