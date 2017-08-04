import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import {Http, Headers, RequestOptions } from "@angular/http";
import { Settings } from '../../providers/settings';
import {Customer} from "../../models/customer";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string, lastName:string, birthday:string, company:string } = {
    name: 'nombre',
    lastName:"apellidos",
    email: 'ejemplo@dom.com',
    password: 'test',
    birthday:'fecha nacimiento',
    company:'empresa'
  };


  private userSchema:any;
  private apiKey:string=this.settings._defaults['apiKey'];
  private uriPath:string=this.settings._defaults['apiEndPoint'];

  constructor(
    public http:Http,
    public settings:Settings,
    private customer:Customer) {
  }

  postRequest() {

    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin','http//destruirdocumentos.es');
    headers.append('Content-Type', 'text/xml' );

    let options = new RequestOptions({ headers: headers });

    let postParams =this.customer.setCustomer(this.account.email,this.account.password,this.account.lastName,this.account.name,1,this.account.birthday,this.account.company);
      //'<prestashop><customer><id_default_group xlink:href="http://destruirdocumentos.com/api/groups/3">3</id_default_group><id_lang xlink:href="http://localhost/pmaproduct.com/api/languages/1">1</id_lang><newsletter_date_add>0000-00-00 00:00:00</newsletter_date_add><ip_registration_newsletter/><last_passwd_gen>2016-10-10 18:25:52</last_passwd_gen><secure_key>cc2167746e11fa675f38e8fa5853f664</secure_key><deleted>0</deleted><passwd>69f22946f088ae51d6abaa70167eeb9c</passwd><lastname>saavdasdasra</lastname><firstname>felipe</firstname><email>repropbando@molomas.com</email><id_gender>1</id_gender><birthday>1975-08-02</birthday><newsletter>0</newsletter><optin>0</optin><website/><company>colprinter sas</company><siret/><ape/><outstanding_allow_amount>0.000000</outstanding_allow_amount><show_public_prices>0</show_public_prices><id_risk>0</id_risk><max_payment_days>0</max_payment_days><active>1</active><note/><is_guest>0</is_guest><id_shop>1</id_shop><id_shop_group>1</id_shop_group><date_add>2016-10-11 00:25:52</date_add><date_upd>2016-10-11 00:25:52</date_upd><associations><groups nodeType="group" api="groups"><group xlink:href="http://destruirdocumentos.com/api/groups/3"><id>3</id></group></groups></associations></customer></prestashop>';

    this.http.post(this.uriPath+"/api"+"/customers/?ws_key="+this.apiKey, postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);// Error getting the data
      });

  }


  doSignup() {
    this.postRequest();
  }
}
