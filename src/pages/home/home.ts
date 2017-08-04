import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import { Settings } from '../../providers/settings';
import {CategoriesPage} from "../categories/categories";

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private apiParams:string = "&ws_key="+ this.APIKey + "&output_format=JSON&display=full";
  private categories:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, private settings:Settings,public menu: MenuController,) {
    this.menu.enable(true);
    let id_parent:number=2; //using id_parent 2 because is the landing page, and 1 is root that includes everything
    let url:string=   this.uriPath + "api/categories/?filter[id_parent]=["
                      + id_parent
                      + "]&filter[active]=[1]" //(active =1) =>TRUE
                      + this.apiParams;
    //building main categories
    console.log(url);
    this.http.get(url).map(res => res.json()).subscribe(data => {
      //for(var index=0;index<data.categories.length;index++){}
      console.log(data.categories);
      this.categories=data.categories;
    });
  }

  ionViewDidEnter() {
    // the root left menu should be enabled on the tutorial page

  }

  pushCategory(categoryId:number){
    // console.log("tipo de pagina"+page_type + "el id de algo"+this.currentCategory);
    this.navCtrl.push(CategoriesPage,{
      currentCategory:categoryId,
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
