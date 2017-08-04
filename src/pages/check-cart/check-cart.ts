import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CartService} from "../cart/cart.service";
import {User} from "../../providers/user";
import {Http} from "@angular/http";
import {Settings} from "../../providers/settings";
import {PlaceOrderPage} from "../place-order/place-order";

/**
 * Generated class for the CheckCartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-check-cart',
  templateUrl: 'check-cart.html',
})
export class CheckCartPage {
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private addresses:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private cartServ:CartService,
              private user:User,
              private http:Http,
              private settings:Settings) {

    //need to render the possible adresses from customers
    //so get adresses
    user.getCustomerId().then(
      resCustId=>{
        let url:string= this.uriPath+ 'api/addresses/?ws_key='+this.APIKey+'&output_format=JSON&filter[id_customer]=['+resCustId+']&display=full';
        console.log(url);
        this.http.get(url)
          .map(res=>res.json())
          .subscribe(data=>this.addresses=data.addresses);
      }
    );
    }

    public selectAddress(id:number){
      this.cartServ.setAddress(id);

      this.navCtrl.push(PlaceOrderPage,{
        cartId:this.cartServ.getCartId()
      }).then(
        response => {
          console.log('Response ' + response);
        },
        error => {
          console.log('Error: ' + error);
        }
      ).catch(exception => {
        console.log('Exception ' + exception);
      });
    }



}
