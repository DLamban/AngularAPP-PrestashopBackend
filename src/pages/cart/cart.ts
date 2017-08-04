import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Product} from "../../models/productXML";
import {CartService} from "./cart.service";
import {Http} from "@angular/http";
import {Settings} from "../../providers/settings";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import {CheckCartPage} from "../check-cart/check-cart";




/**
 * Generated class for the CartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  private products:Array<Product>;
  private productsInfo:any;
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private emptyCart:boolean=true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private cart:CartService,
              private http:Http,
              private settings:Settings) {

    let url:string;
   // console.log(cart.createCart());
    if (cart.getCartProducts().length==0){
      //empty cart, show a disclaimer

    }else{
      this.emptyCart=false;
      this.productsInfo=[];

      url= this.uriPath+ 'api/carts/'+ cart.getCartId() + '?ws_key='+ this.APIKey + '&output_format=JSON';

      this.http.get(url)
        //using mergemap operator to work in the products collection
        .mergeMap((response)=> response.json().cart.associations.cart_rows)
        .subscribe((data:any) => {
          url=this.uriPath+ 'api/products/'+ data.id_product + '?ws_key='+ this.APIKey + '&output_format=JSON';
          this.http.get(url).map(res=>res.json()).subscribe(innerData=>{
            //build an productcart object to be pushed imgUrl is not implemented yet
            let productCart:{name:string, imgUrl:string, quantity:number}={name:innerData.product.name,imgUrl:"",quantity:data.quantity};
            this.productsInfo.push(productCart);
            console.log(this.productsInfo);
          });
        });
    }
  }
  public checkCart(){
    //go to check cart page and handle from there
    this.navCtrl.push(CheckCartPage,{
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
