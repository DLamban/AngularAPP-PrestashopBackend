import {Component, ElementRef, Injectable} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
//import { DescriptionShort } from './product.description_short';
//adding Domsanitizer to enable cross siting
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductService } from './product.service';
import { Settings } from '../../../../providers/settings';
import { CartService} from "../../../cart/cart.service"
//TODO: hay que trocear el html que viene de description_short para crear el objeto y remaquetarlo
//estoy en ello, menudo infierno gordo
//ahora tengo el problema de los pdf, pero eso sera para otro dia.
@IonicPage()

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})


export class ProductPage {
  private productId:number;
  private videoUrl: SafeResourceUrl;

  private APIKey:string=this.settings._defaults['apiKey'];
  private URI:string=this.settings._defaults['apiEndPoint'];//we are at products...
  private APIParams:string= '?ws_key='+this.APIKey+'&output_format=JSON';
  private imgUrl:string;
  private description_short:string;
  private youtubeLinkApiCall:string;
  private youtubeLink:string;
  private price:number;
  private productname:string;
  private productOptions:any;
  private showCart:boolean=false;
  private productsCartBadge:number;
  constructor(
    private settings:Settings,
    private domSanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private productService: ProductService,
    private cartService:CartService,
    private el: ElementRef) {

    this.productOptions=[];
    this.productId=navParams.get("currentId");
    this.imgUrl=navParams.get("imgUrl");
    this.productService.setIdProduct(this.productId);
    //building url
    let url:string;
    url=this.URI+"api/products/"+this.productId+this.APIParams;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.productname=data.product.name;
      //conseguir las opciones del producto (GET)
      let _productCombinations:any= data.product.associations.product_option_values;
      this.price= data.product.price;
      for (var option_id in _productCombinations){
        option_id=_productCombinations[option_id].id;
        url=this.URI + "api/product_option_values/"+ option_id + this.APIParams;
        this.http.get(url).map(res => res.json()).subscribe(optionsData => {
          this.productOptions.push(optionsData.product_option_value);
        });
      }
    });

      /**NEED TO BUILD A AJAX CALL TO GET THE IMAGE
     * could pass it from previous page so i'll avoid another call
     */
    this.youtubeLinkApiCall=this.URI+ '/api/youtube_videos' + this.APIParams + '&filter[id_product]=['+ this.productId+']&display=full';
     //ajax call to get youtube video link
    this.http.get(this.youtubeLinkApiCall).map(res => res.json()).subscribe(data => {
      //this try/catch is here because not all of the products have video
      try {
        this.youtubeLink='http://www.youtube.com/embed/'+data.videos[0].legend;
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.youtubeLink);
      }
      catch(err) {
        console.log("no hay videos asociados a este producto");
      }
    });
  }

  /**
   * esta funcion abrira los pdf en el navegador interno del movil ya que no hay otra manera sino
   * @param url
   */
  openPdf(url){
    //  var ref = window.open(url, '_blank', 'location=no');
  }

  checkCart(){
    if (this.cartService.getCartProducts().length!=0){
      this.showCart=true;
    }

    this.productsCartBadge=this.cartService.getCartProducts().length;
    console.log(this.cartService.createCart());
  }

  ngOnInit(){
    this.checkCart();
  };

  /**
   * Funcion para llamar al servicio del carrito y añadir el producto seleccionado
   * @param {number} _productId
   */
  addToCart(){
    this.cartService.addProduct(this.productId);
    this.checkCart();
  }



}
