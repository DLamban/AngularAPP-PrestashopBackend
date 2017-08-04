import {Component, Inject} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { Http } from '@angular/http';
import { ProductsPage } from './products/products';
import {Cart} from "../../models/cart";
@IonicPage()

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})




export class CategoriesPage {
  categories:any;



  private uriPath:string= this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private id_parent:number;//maybe could change the number for the actual name. Help the users and yourself=>paso...
  private show:boolean = true;

  //****
  //inner vars for flow control
  private currentCategory:number;
  private showCart:boolean=false;
  private productsCartBadge:number;
  constructor(public navCtrl: NavController,
              public http: Http,
              public navParams:NavParams,
              public settings:Settings,
              private cart:Cart) {

    let APIparams:string;
    /**
    *This If/else check if it's first initializated
    */
    //first view, with empty params
    if (navParams.get("currentCategory")==undefined){//init the page
      this.currentCategory=2;
      this.id_parent=2;
    } else {
       //need to fix dat
       this.currentCategory=navParams.get("currentCategory");
       this.id_parent=this.currentCategory;//it's current cuz is recursive
    }
    //this get level_depth and id_parent, the two things to locate categories in prestashop db
    APIparams=  "&filter[id_parent]=["
                + this.id_parent
                + "]&filter[active]=[1]";//(active =1) =>TRUE
    this.populateProducts(APIparams,this.currentCategory);
  }

  public reloadCategories(APIparams:string,id_parent:number){

    this.currentCategory=id_parent;

    APIparams=  "&filter[id_parent]=[" + id_parent + "]&filter[active]=[1]";

    let url:string = this.uriPath + 'api/categories/?ws_key=' + this.APIKey + '&output_format=JSON' + APIparams;
    //check if next page will be a product or another category page

    this.http.get(url).map(res => res.json()).subscribe(data => {
       if (data.categories==null){
          this.auxNav(ProductsPage);
        }
        else{
          this.auxNav(CategoriesPage);
        }
    });
  }

  /**
   * check if there is any product in the cart to show the cart icon
   */
  ionViewWillEnter(){
    if (this.cart.getCartProducts().length!=0){
      this.productsCartBadge=this.cart.getCartProducts().length;
      this.showCart=true;
    }
  }

  public auxNav(page_type:any){
   // console.log("tipo de pagina"+page_type + "el id de algo"+this.currentCategory);
    this.navCtrl.push(page_type,{
      currentCategory:this.currentCategory,
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

  public populateProducts(APIparams:string,_currentCategory:number){
    this.currentCategory=_currentCategory;
    APIparams=  "&filter[id_parent]=["
                + this.currentCategory
                + "]&filter[active]=[1]";//(active =1) =>TRUE//costri programacion

    let url:string = this.uriPath + 'api/categories/?ws_key='
                      + this.APIKey + '&output_format=JSON'
                      + APIparams;
    //getting the id of categories via prestashop webservice
    //remember it's ASYNCHRONOUS
    this.http.get(url).map(res => res.json())
      .subscribe(data => {
        //now we got the categories id's, so we need to find the child categories and show them on click
        let _categories=[];
        let categoriesLength:number=data.categories.length;
        let loadedElements:number=0;
            for (var index=0;index<categoriesLength ; index++){
            var category_id=data.categories[index].id;
            let url:string = this.settings._defaults['apiEndPoint']+'api/categories/'+ category_id
                            +'?ws_key=' + this.APIKey + '&output_format=JSON';
            //another ajax request inside, this is getting crazy
            this.http.get(url).map(result => result.json()).subscribe(innerData => {
              innerData.category.imgUrl= this.uriPath+"api/images/categories/" +innerData.category.id + "?ws_key="+this.APIKey;
              _categories.push(innerData.category);
              //after a push-> reorder array, not the best for performance, but it's a small array and is part of the asynchronous way
              _categories=_categories.sort((a, b) => {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0;
              });
            },err=>console.log(err),
              ()=>{
                loadedElements++;
                if(loadedElements==categoriesLength){
                  this.show=false;
                }
              });
          }
          this.categories=_categories;
    });
  }
}

