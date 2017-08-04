import {Settings} from "../providers/settings";
import {Inject, Injectable} from '@angular/core';
//imported to add Md5 hash capabilities
import * as CryptoJs from "crypto-js";
import { DatePipe } from '@angular/common';
import {Product} from "./productXML";
import {Http,Headers, RequestOptions} from "@angular/http";
import {User} from "../providers/user";


@Injectable()


export class Cart{
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private secureKey:string;
  private cartProducts:Array<Product>;
  private email:String;
  private cartPosted:boolean=false;
  private cartApiId:number;
  private userId:number;
  private deliveryAddressId:number=0;
  private invoiceAddressId:number=0;

  constructor(private settings:Settings,
              private http:Http,
              private user:User
  ){
    this.cartProducts=[];
    this.setCartUser();
  }

  saveCart(){//call POST/UPDATE in cart order

  }

  /**
   * We need 2 address, this is the delivery
   * @param {number} id
   */
  setCartAddressDelivery(id:number){
    this.deliveryAddressId=id;
  }

  /**
   * We need 2 address, this is the invoice
   * @param {number} id
   */
  setCartAddressInvoice(id:number){
    this.invoiceAddressId=id;
  }
  getCartAddress(){
    return this.deliveryAddressId;
  }
  setCartUser(){
    this.user.getCustomerId().then(
      res=>{this.userId=res;}
    );
  }

  public getCartId(){
    return this.cartApiId;
  }

  getCartProducts(){
    return this.cartProducts;
  }

  /**
   * updating the cart info to the web
   * if it's the first time we post it and get the Id for updating later
   */
  updateCart(){
    if (this.cartPosted==false){
      this.doPost();
    }
    else{
      this.doPut();
    }
  }

  /**
   * this is the POST method to server. I have another PUT method because this model will handle that (not best ideas)
   */
  doPost(){
    let url:string = this.uriPath + 'api/carts/?ws_key=' + this.APIKey+'&output_format=JSON';

    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin','http//destruirdocumentos.es');
    headers.append('Content-Type', 'text/xml' );

    let options = new RequestOptions({ headers: headers });
    let postParams:string= this.getCart();
    this.http.post(url, postParams, options)
      .subscribe(data => {
        var response=JSON.parse(data['_body']);
        this.cartApiId=response.cart.id;
        this.cartPosted=true;
      }, error => {
        console.log(error);// Error getting the data
      });

  }

  doPut(){
    let url:string = this.uriPath + 'api/carts/?ws_key=' + this.APIKey+'&output_format=JSON';

    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin','http//destruirdocumentos.es');
    headers.append('Content-Type', 'text/xml' );

    let options = new RequestOptions({ headers: headers });
    let postParams:string= this.getCart();
    this.http.put(url, postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);// Error getting the data
      });
  }

  addProductCart(_product:Product){
    for (var item of this.cartProducts){
      if (_product.getId()==item.getId()){
        item.updateQuantity();
        this.updateCart();
        return false;
      }
    }
    this.cartProducts.push(_product);
    this.updateCart();
  }

  /**
   * Passing all the params make a new customer POST body needed for POST method
   * @param {string} email
   * @param {string} passwd
   * @param {string} lastName
   * @param {string} firstName
   * @param {number} id_gender
   * @param {string} birthday
   * @param {string} company
   * @param {number} customerGroup
   * @param {Product} cartProducts because product XML already outputs the XML needed we just need to use productXML method
   * @returns {string} a XML with all needed in the body POST to prestashop
   */
  getCart(){
    //adding customer to group 3 by default
    //generate random security key
    this.secureKey=CryptoJs.lib.WordArray.random(128/8);
    //building cart_rows
    let cartRows:string="";
    for (var product of this.cartProducts){
      cartRows+=product.getProductXML();
    }
    let idString:string;
    idString=this.cartPosted?'<id>'+this.cartApiId+'</id>':'<id/>';

    let bodyPostXML:string=
      `<prestashop>
        <cart>
          `+idString+`
          <id_address_delivery xlink:href="`+this.uriPath+`api/addresses/`+this.deliveryAddressId+` ">`+this.deliveryAddressId+`</id_address_delivery>
          <id_address_invoice xlink:href="`+this.uriPath+`api/addresses/`+this.invoiceAddressId+`">`+this.invoiceAddressId+`</id_address_invoice>
          <id_currency xlink:href="`+this.uriPath+`api/currencies/1">1</id_currency>
          <id_customer xlink:href="`+this.uriPath+`api/customers/`+this.userId+`">`+this.userId+`</id_customer>
          <id_guest/>
          <id_lang xlink:href="`+this.uriPath+`api/languages/1">1</id_lang>
          <id_shop_group>1</id_shop_group>
          <id_shop>1</id_shop>
          <id_carrier>93</id_carrier>
          <recyclable>0</recyclable>
          <gift>0</gift>
          <gift_message/>
          <mobile_theme>0</mobile_theme>
          <delivery_option>a:1:{i:191;s:3:"93,";}</delivery_option>
          <allow_seperated_package>0</allow_seperated_package>
          <date_add/>
          <date_upd/>
          <associations>
            <cart_rows nodeType="cart_row" virtualEntity="true">
              `+ cartRows +`
            </cart_rows>
          </associations>
        </cart>
       </prestashop>`;
    return bodyPostXML;
  }
}
