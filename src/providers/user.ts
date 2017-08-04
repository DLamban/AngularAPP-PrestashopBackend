import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {Settings} from "./settings";
import {Http} from "@angular/http";
import { ToastController } from 'ionic-angular';
//we need promises or the content to render will be null and bad things happen
import 'rxjs/add/operator/toPromise';
import {toPromise} from "rxjs/operator/toPromise";
@Injectable()
/**
 * servicio que controla a los usuarios tanto el logging como la informacion asociada como cliente
 */
export class User {
  private islogged:boolean=false;
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private apiKey:string=this.settings._defaults['apiKey'];

  constructor(
    private settings:Settings,
    private storage:Storage,
    private http:Http,
    private toastCtrl: ToastController) {

  }

  /**
   * prestashop webservice it's simple, so we just try to get the customer id with the email and passwd provided
   * if it doesn't get a valid id is a failed login
   * the url to get customer is likee this:
   * pasword of prestashop is = Md5(cookieKey + passwd)
   * @param {string} email
   * @param {string} Md5passwd
   * @returns {boolean} false, wrong login, true correct
   */
  public login(email:string,Md5passwd:string){
    let apiParams:string="api/customers/?filter[email]="+email
      + "&filter[passwd]="+Md5passwd
      + "&output_format=JSON";
    let url:string=  this.uriPath+apiParams+"&ws_key="+this.apiKey;

    /**
     * returned promise so the login wait until prestashop gives the answer
     */
   return this.http.get(url).toPromise().then(response => {
     if(response.json().length==0){//API returns empty array because the combination email/passwd doesn't exist
       let toast = this.toastCtrl.create({
         message: "Usuario o password incorrectos",
         duration: 3000,
         position: 'top'
       });
       toast.present();
       /**logging false*/
       this.islogged=false;
     }
     else{ //we found a customer
       this.islogged=true;
       //save user details
       this.storage.set('email',email);
       //I don't know what is worst, but I think I stick with the MD5 passwd
       this.storage.set('Md5Passwd',Md5passwd);
       this.storage.set('logged','true');
       let url:string=this.uriPath+'api/customers/?ws_key='+this.apiKey+'&filter[email]=['+email+']&output_format=JSON';
       this.http.get(url)
         .map(res=>res.json())
         .subscribe(data=>this.storage.set('idCustomer',data.customers[0].id))
     }
     return this.islogged;

   });

  }

  getUserEmail(){
    return this.storage.get('email').then(
      res=>{return res;});
  }

  getCustomerId(){
    return this.storage.get('idCustomer').then(
      res=>{return res;});
  }
  getLoggingInfo(){
    return this.storage.get('logged');
  }

}
