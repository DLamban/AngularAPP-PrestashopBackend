import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/user';
//import { Auth /*, User*/ } from '@ionic/cloud-angular';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../providers/settings';
import { Http } from "@angular/http";
import * as CryptoJs from "crypto-js";//imported to add Md5 hash capabilities
import { Storage } from '@ionic/storage';
import {MainPage} from "../pages"; //needed storage for reference ths user, not really, cuz i got a user service

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  // The account fields for the login form.
  // Login based on email
  account: { email: string, password: string } = {
    email: 'web2@pmaproduct.com',
    password: 'pppp'
  };

  // Our translated text strings
  private loginErrorString: string;
  constructor(
    public navCtrl: NavController,
    public storage:Storage,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public settings:Settings,
    public http:Http,
    private user:User) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {

    //cipher passwd here and don't move too much between functions
    let Md5Passwd:string = CryptoJs.MD5(this.settings._defaults['cookieKey']+this.account.password) as string ;//casting as string, be simple
    //call user login service that will return true or false and then do the login or reject
    this.user.login(this.account.email,Md5Passwd.toString())
      .then(result=>{
        if (result==true){
          let toast = this.toastCtrl.create({
            message: "Bienvenido a Araprofi",
            duration: 900,
            position: 'top'
          });
          toast.present();
          this.navCtrl.setRoot(MainPage);
        }
        //else do nothing, user class will handle that
      })
      .catch(()=>console.log("error"));
    //if(this.user.login(this.account.email,Md5Passwd.toString())) this.navCtrl.push(MainPage);

  }
}
