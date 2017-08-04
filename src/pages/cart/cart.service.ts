/**
 * This service will handle the cart, starting NOW!
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Settings } from '../../providers/settings';
import { Product } from "../../models/productXML";
import { Cart } from "../../models/cart";
import { User } from "../../providers/user";

@Injectable()

export class CartService {
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
 //s private cart:Cart;
  private cartProducts:Array<Product>;
  constructor(public http: Http,private settings:Settings, private user:User,private cart:Cart) {
    //include in constructor all the references needed
  }
  public setAddress(id:number){
    //ATM we use the same direction for invoice and delivery, easy to change in function, bit longer in the views
    this.cart.setCartAddressDelivery(id);
    this.cart.setCartAddressInvoice(id);
    //need to update cart, for adding the address
    this.cart.updateCart();
  }
  public clearCart(){
    this.cart=null;
  }

  public addProduct(productId:number, _quantity:number=1){
    //check first if there's any cart
    if (!this.cart){
      console.log("undefined cart");
      let cartProducts=[];
      this.cart.getCart();
    }

    let product:Product = new Product( productId,0,this.cart.getCartAddress(),_quantity,this.settings);
    this.cart.addProductCart(product);
  }

  public getCartProducts(){
    return this.cart.getCartProducts();
  }
  public getCartId(){
    return this.cart.getCartId();
  }
  /**
   *
   */
  public createCart(){

    return this.cart.getCart();


  }
}
