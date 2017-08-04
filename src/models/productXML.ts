import {Injectable} from "@angular/core";
import {Settings} from "../providers/settings";
@Injectable()

export class Product{
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private productName:string;
  /**
   *
   * @param {number} id
   * @param {number} id_attribute
   * @param {number} id_address_delivery
   * @param {number} quantity
   * @param {Settings} settings Only needed because the XML construction needs the API endpoint, but nothing more
   */
  constructor(private id:number,
              private id_attribute:number,
              private id_address_delivery:number,
              private quantity:number,
              private settings:Settings){

  }
  public getName(){
    return this.productName;
  }
  public setName(_name:string){
    this.productName=_name;
  }

  public getItemNumber(){
    return this.quantity;
  }

  public getId(){
    return this.id;
  }

  public updateQuantity(quantity=1){
    this.quantity+= quantity;
  }
  /**
   * This XML is good enough for cart order, but  it won't work with orders
   * @returns {string} string with the xml built, ready to go
   */
  public getProductXML( ){

      let productString:string =
        `<cart_row>
           <id_product xlink:href="`+this.uriPath+`api/products/`+this.id+`">`+this.id+`</id_product>
           <id_product_attribute xlink:href="`+this.uriPath+`api/combinations/`+this.id_attribute+`">`+this.id_attribute+`</id_product_attribute>
           <id_address_delivery xlink:href="`+this.uriPath+`api/addresses/`+this.id_address_delivery+`">`+this.id_address_delivery+`</id_address_delivery>
           <quantity>`+this.quantity+`</quantity>
        </cart_row>
        `;
    return productString;
  }
}
