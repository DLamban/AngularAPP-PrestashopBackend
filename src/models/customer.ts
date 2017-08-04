import {Settings} from "../providers/settings";
import { Injectable } from '@angular/core';
import * as CryptoJs from "crypto-js";
import { DatePipe } from '@angular/common';

//imported to add Md5 hash capabilities

@Injectable()


export class Customer{
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private secureKey:string;
  constructor(private settings:Settings){

  }
  getCustomer(){
    return (this.setCustomer("probando@gothelife.com","dsadsdas","dsadsdas","dsadsdas",1,"1984-08-16","dsadsdas",));
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
   * @returns {string} a XML with all needed in the body POST to prestashop
   */
  setCustomer(email:string,
              passwd:string,
              lastName:string,
              firstName:string,
              id_gender:number,
              birthday:string,
              company:string,
              customerGroup:number=3){
    //adding customer to group 3 by default
    //generate random security key
    this.secureKey=CryptoJs.lib.WordArray.random(128/8);
    //encrypt passwd
    passwd= CryptoJs.MD5(this.settings._defaults['cookieKey']+passwd) as string ;//casting as string, be simple
    let dateNow : Date = new Date();
    //Formateo perfecto con esto sacado de Stack Overflow!
    let dateAdded = dateNow.toISOString().slice(0, 19).replace('T', ' ');

    let bodyPostXML:string=
    `<prestashop>
      <customer>
        <id_default_group xlink:href="`+ this.uriPath + `api/groups/`+customerGroup+`">`+customerGroup+`</id_default_group>
        <id_lang xlink:href="`+this.uriPath+`/api/languages/1">1</id_lang>
        <newsletter_date_add>0000-00-00 00:00:00</newsletter_date_add>
        <ip_registration_newsletter/>
        <last_passwd_gen>`+dateAdded+`</last_passwd_gen>
        <secure_key>` + this.secureKey + `</secure_key>
        <deleted>0</deleted>
        <passwd>`+ passwd +`</passwd>
        <lastname>`+lastName+`</lastname>
        <firstname>`+firstName+`</firstname>
        <email>`+ email+`</email>
        <id_gender>`+id_gender+`</id_gender>
        <birthday>`+birthday+`</birthday>
        <newsletter>0</newsletter>
        <optin>0</optin>
        <website/>
        <company>`+company+`</company>
        <siret/>
        <ape/>
        <outstanding_allow_amount>0.000000</outstanding_allow_amount>
        <show_public_prices>0</show_public_prices>
        <id_risk>0</id_risk>
        <max_payment_days>0</max_payment_days>
        <active>1</active>
        <note/>
        <is_guest>0</is_guest>
        <id_shop>1</id_shop>
        <id_shop_group>1</id_shop_group>
        <date_add>`+dateAdded+`</date_add>
        <date_upd>`+dateAdded+`</date_upd>
        <associations>
          <groups nodeType="group" api="groups">
            <group xlink:href="`+this.uriPath+`api/groups/`+customerGroup+`">
              <id>`+customerGroup+`</id>
            </group>
          </groups>
        </associations>
    </customer>
  </prestashop>`
  return bodyPostXML;
  }
}
