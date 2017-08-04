import {Settings} from "../providers/settings";
import { Injectable } from '@angular/core';
import * as CryptoJs from "crypto-js";
import {User} from "../providers/user";
import {CartService} from "../pages/cart/cart.service";
import {Http,Headers, RequestOptions} from "@angular/http";

//imported to add Md5 hash capabilities

@Injectable()


export class Order{
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private secureKey:string;
  private total_paid_tax_excl:number=0;
  private order_rows:Array<string>;
  constructor(private settings:Settings,private user:User,private cartServ:CartService,private http:Http){
      this.order_rows=[];
  }

  /**
   * We need all the products, SUM(products*unitary_price)
   * We can't return a number because it's a asinchronous operation, and I'm in a hurry,
   * so just expect that it has finished ^_^
   */
  public createOrderAttr(){
    let total_paid:number;
    let cartProducts=this.cartServ.getCartProducts();
    //iterate trough  products
    let countProductsSummed:number=0;
    let lengthProducts:number=cartProducts.length;
    for (var product of cartProducts){
      let url:string= this.uriPath + 'api/products/'+product.getId()+'?ws_key='+this.APIKey + '&output_format=JSON';
      this.http.get(url).map(res=>res.json().product).subscribe(productData=>{
        let productPrice:number=parseFloat(productData.price);
        this.total_paid_tax_excl=this.total_paid_tax_excl+productPrice;
        //this.createRows(productData);
        countProductsSummed++;
        //We reached every product
        if (countProductsSummed==lengthProducts){
          //continue
        }

      });

    }
    this.createRows();

  }

  /**
   * watch out because this number changes through runtime
   * @returns {number}
   */
  public getTotalPaid(){
    return this.total_paid_tax_excl;
  }

  /**
   * order_rows are a bit more complex than cart
   */
  public createRows(){
    let cartId= this.cartServ.getCartId();
    let url :string= this.uriPath+'api/carts/'+cartId+'?ws_key='+this.APIKey+'&output_format=JSON';
    this.http.get(url).map(res=>res.json().cart).subscribe(cartData=>{
      console.log(url);
      console.log(cartData);
      let cartLength:number=cartData.associations.cart_rows.length;
      let countCartRows:number=0;
      for (var cart_row of cartData.associations.cart_rows){
        let url=this.uriPath + 'api/products/'+cart_row.id_product+'?ws_key='+this.APIKey + '&output_format=JSON';
        this.http.get(url).map(res=>res.json().product).subscribe(productData=>{
          let orderRow= this.createRow(cart_row,productData);
          //console.log("este es el order row"+orderRow);
          this.order_rows.push(orderRow);
          countCartRows++;

          if (countCartRows==cartLength){
            //we finished with rows so build order
            this.postOrderToServer(this.getOrderXML(productData,cartData));

          }
        });
      }


    },err=>console.log(err));

  }
  postOrderToServer(xmlPost:string){

      let url:string = this.uriPath + 'api/orders/?ws_key=' + this.APIKey+'&output_format=JSON';

      var headers = new Headers();
      headers.append('Access-Control-Allow-Origin','http//destruirdocumentos.es');
      headers.append('Content-Type', 'text/xml' );

      let options = new RequestOptions({ headers: headers });
      let postParams:string= xmlPost;
      this.http.post(url, postParams, options)
        .subscribe(data => {
          console.log(JSON.parse(data['_body']));
        }, error => {
          console.log(error);// Error getting the data
        });


  }
  public createRow(cartData:any,productData:any){
    console.log(productData);
    let orderRow:string=
      `
<order_row>
  <id/>
      <product_id>`+ cartData.id_product +` </product_id>
      <product_attribute_id>`+productData.associations.stock_availables[0].id_product_attribute+`</product_attribute_id>
      <product_quantity>`+cartData.quantity+`</product_quantity>
      <product_name>`+productData.name+`</product_name>
      <product_reference/><product_ean13/><product_upc/>
      <product_price>`+productData.price+`</product_price>
      <unit_price_tax_incl>`+(productData.price*1.21)+`</unit_price_tax_incl>
      <unit_price_tax_excl>`+productData.price+`</unit_price_tax_excl>
</order_row>`;
    return orderRow;
  }
  public getOrderRowsXML(orderRowsArr:Array<string>){
    let orderRowsXML:string="";
    for (var orderRow of orderRowsArr){
      orderRowsXML=orderRowsXML+orderRow;
    }
    return orderRowsXML;
  }

  getOrderXML(productData:any,cartData:any){
    //adding customer to group 3 by default
    //generate random security key
    this.secureKey=CryptoJs.lib.WordArray.random(128/8);

    let bodyPostXML:string=
      `<prestashop>
        <order>
          <id/>
          <id_address_delivery xlink:href="`+this.uriPath+`api/addresses/`+cartData.id_address_delivery+`">`+cartData.id_address_delivery+`</id_address_delivery>
          <id_address_invoice xlink:href="`+this.uriPath+`api/addresses/`+cartData.id_address_invoice+`">`+cartData.id_address_invoice+`</id_address_invoice>
          <id_cart xlink:href="`+this.uriPath+`api/carts/`+cartData.id+`">`+cartData.id+`</id_cart>
          <id_currency xlink:href="`+this.uriPath+`api/currencies/1">1</id_currency>
          <id_lang xlink:href="`+this.uriPath+`api/languages/1">1</id_lang>
          <id_customer xlink:href="`+this.uriPath+`api/customers/`+cartData.id_customer+`">`+cartData.id_customer+`</id_customer>
          <id_carrier xlink:href="`+this.uriPath+`api/carriers/93">93</id_carrier>
          <current_state xlink:href="`+this.uriPath+`api/order_states/10">10</current_state>
          <module>bankwire</module>
          <invoice_number>0</invoice_number>
          <invoice_date>0000-00-00 00:00:00</invoice_date>
          <delivery_number>0</delivery_number><delivery_date>0000-00-00 00:00:00</delivery_date>
          <valid>1</valid>
          <date_add>2017-07-20 09:48:08</date_add><date_upd>2017-07-20 09:48:09</date_upd>
          <shipping_number notFilterable="true"/><id_shop_group>1</id_shop_group>
          <id_shop>1</id_shop>
          <secure_key>64b21ba29d80a5cc26cbff7e9e81b550</secure_key>
          <payment>Transferencia bancaria</payment><recyclable>0</recyclable>
          <gift>0</gift>
          <gift_message/>
          <mobile_theme>0</mobile_theme>
          <total_discounts>2.400000</total_discounts>
          <total_discounts_tax_incl>2.400000</total_discounts_tax_incl>
          <total_discounts_tax_excl>1.980000</total_discounts_tax_excl>
          <total_paid>45.520000</total_paid>
          <total_paid_tax_incl>45.520000</total_paid_tax_incl>
          <total_paid_tax_excl>37.620000</total_paid_tax_excl>
          <total_paid_real>45.520000</total_paid_real>
          <total_products>39.600000</total_products>
          <total_products_wt>47.920000</total_products_wt>
          <total_shipping>0.000000</total_shipping>
          <total_shipping_tax_incl>0.000000</total_shipping_tax_incl>
          <total_shipping_tax_excl>0.000000</total_shipping_tax_excl>
          <carrier_tax_rate>21.000</carrier_tax_rate>
          <total_wrapping>0.000000</total_wrapping>
          <total_wrapping_tax_incl>0.000000</total_wrapping_tax_incl>
          <total_wrapping_tax_excl>0.000000</total_wrapping_tax_excl>
          <round_mode>2</round_mode><round_type>2</round_type>
          <conversion_rate>1.000000</conversion_rate>
          <reference/>
            <associations>
              <order_rows nodeType="order_row" virtualEntity="true">
               `+
                  this.getOrderRowsXML(this.order_rows)
                +`
              </order_rows>
            </associations>
          </order>
       </prestashop>`;
    return bodyPostXML;
  }
}
