import { Injectable } from '@angular/core';
import { ElementRef, Renderer2  } from '@angular/core';
import { Http } from '@angular/http';
//we need promises or the content to render will be null and bad things happen
import 'rxjs/add/operator/toPromise';
import { Settings } from '../../../../providers/settings';
@Injectable()
//this stupid service will take care of handling the extremely annoying work of parsing the plain html received from prestashop
export class ProductService {
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private results:any;
  private idProduct:number;
  constructor(public http: Http,private settings:Settings) {
      //include in constructor all the references needed
  }

  setIdProduct(id_product:number){
    this.idProduct=id_product;
  }

  /**
   * Asignamos el valor de idProduct desde la pagina principal de producto para que puedan comunicarse entre
   * product.ts y description_short.ts
   * @returns {Promise<any>} lo que devuelve es la description short que recibe de prestashop
   */
  getDescriptionShort(){
    let description_short: string;
    let urlQuery = this.uriPath + "api/products/" + this.idProduct + "?ws_key=" + this.APIKey + '&output_format=JSON';
    let promise = new Promise((resolve, reject) => {
      this.http.get(urlQuery)
        .toPromise()
        .then(
          res=>{
            this.results=res.json().product.description_short;
            resolve(this.results);
          },
          msg=>{reject(msg)}
        );
    });
    return promise;
  }
}
