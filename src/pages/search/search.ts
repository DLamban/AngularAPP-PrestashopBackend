import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ProductPage } from '../../pages/categories/products/product/product';
import { CategoriesPage } from '../../pages/categories/categories';
import { ProductsPage } from '../../pages/categories/products/products';
import {Settings} from "../../providers/settings";

/**
 * Generated class for the SearchPage page.
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})

export class SearchPage {
  private searchTerm:string='';
  private products:any;
  private categories:any;
  private id:number;
  private url:string;
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http:Http,
    public settings:Settings) {


  }
  pushProductPage(id:number){
    this.navCtrl.push(ProductPage,{
      currentId:id,
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
  pushCategoryPage(id:number){
    console.log(id);
    this.navCtrl.push(ProductsPage,{
      currentCategory:id,
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

  apiSearchCall(){
    //DISPLAY=full gives me a 500 error :'( so avoid that even it's pretty sad
    let url:string=this.uriPath+"api/search?language=1&ws_key="+this.APIKey+'&filter[active]=[1]&output_format=JSON&query='+ this.searchTerm;
    let _products=[];
    let _categories=[];
    this.http.get(url).map(res => res.json()).subscribe(data => {
      //si la respuesta es un array vacio no hacer nada, esta claro
      if (data && data.length <= 0 ){
        //null search return
        return false;
      }
      //this.products=data.products;
      //for some reason that I don't wanna bother, prestashop returns an empty last element in so I remove last element
      //this.products.pop();
      //same pop on categories
      //this.categories=data.categories;
      //this.categories.pop();
      //cargando los datos internos de los productos
      for (var index=0;index<data.products.length;index++){
        let product_id=data.products[index].id;
        url=this.uriPath+"api/products/"+ product_id + "&ws_key=" + this.APIKey+"&output_format=JSON";
        this.http.get(url).map(res => res.json()).subscribe(innerData => {
          _products.push(innerData.product);
        });
      }
      this.products=_products;

      for (var index=0;index<data.categories.length;index++){
        let category_id=data.categories[index].id;
        url=this.uriPath+"api/categories/"+ category_id + "&ws_key=" + this.APIKey+"&output_format=JSON";
        this.http.get(url).map(res => res.json()).subscribe(innerData => {
          _categories.push(innerData.category);
        });
      }
      this.categories=_categories;
    });
  }



}
