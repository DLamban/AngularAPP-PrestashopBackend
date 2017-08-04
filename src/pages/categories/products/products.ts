import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ProductPage } from './product/product';
import { Settings } from '../../../providers/settings';
import {Cart} from "../../../models/cart";

@IonicPage()

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})

export class ProductsPage {
  private statusMsg:string;//just for debug
  private products:any;

  //config files hardcoded, showing my inhability to setup enviroment config
  private uriPath:string=this.settings._defaults['apiEndPoint'];
  private APIKey:string=this.settings._defaults['apiKey'];
  private imgUrl:string;
  private show:boolean=true;
  private categoryDescription:string;
  private showCart:boolean;
  private productsCartBadge:number;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, public settings:Settings,private cart:Cart) {
    //multiple products based on id_category_default
    let category=navParams.get("currentCategory");
    //ATM, category is empty so hardcoded all the way
    //let url:string=this.uriPath+'/api/categories/?ws_key=' + this.APIKey+ '&filter[id_category_default]=['+ category +']&output_format=JSON&display=full';
    let url:string=this.uriPath+'/api/categories/'+category+'?ws_key=' + this.APIKey+ '&output_format=JSON';

    let _products=[];

    this.http.get(url).map(res => res.json()).subscribe(data => {
        let productsLength:number= data.category.associations.products.length;
        let productsLoaded:number=0;
        console.log(data.category);
        this.categoryDescription=data.category.description;

        for (let product of data.category.associations.products){
          //otra llamada a la api para conseguir la imagen pffff
          let urlImgApiCall:string= this.uriPath+ 'api/products/' + product.id +"?ws_key="+this.APIKey+"&output_format=JSON&filter[active]=[1]";
          this.http.get(urlImgApiCall).map(res=>res.json()).subscribe(data=>{
            let _product:any=data.product;
            _product.imgUrl= this.uriPath+"api/images/products/" + data.product.id+"/"+ data.product.associations.images[0].id + "?ws_key="+this.APIKey;
            _products.push(_product);
            //igual que en categorias despues de introducir un elemento en el array lo reordenamos, son cosas de la programacion asincrona
            _products=_products.sort((a, b) => {
              if (a.name < b.name) return -1;
              else if (a.name > b.name) return 1;
              else return 0;
            });
          } ,()=>console.log("error cargando imagenes")
            ,()=>{
              productsLoaded++;
              if (productsLoaded==productsLength){
                console.log("loaded everything")
                this.show=false;
              }
          });
        }
    });
    this.products=_products;
  }
  ionViewWillEnter(){
    if (this.cart.getCartProducts().length!=0){
      this.productsCartBadge=this.cart.getCartProducts().length;
      this.showCart=true;
    }
  }
  showProduct(_id:number){
    //cuando pusheamos la pagina de producto buscamos su imgUrl para pasarla y evitar otra llamada Ajax en la pagina de producto
    for (var index=0;index<this.products.length;index++){
      if(this.products[index].id==_id){
        //tenemos una coincidencia
        this.imgUrl= this.products[index].imgUrl;
        break;
      }
    }

    /*should do this,it's cleaner*/

    //for (this.products['id'])
    this.navCtrl.push(ProductPage,{
      currentId:_id,
      imgUrl:this.imgUrl
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
