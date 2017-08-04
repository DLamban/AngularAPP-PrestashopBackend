import {Component, Injectable} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ProductService } from './product.service';
import { ElementRef, Renderer2  } from '@angular/core';
import { Settings } from '../../../../providers/settings';
//we need promises or the content to render will be null and bad things happen
import 'rxjs/add/operator/toPromise';
@IonicPage()
@Injectable()
@Component({
  selector: 'description-short',
  templateUrl: 'product.description_short.html',
})


export class DescriptionShort {
  private nativeElement:Node;
  private baseURI:string;
  constructor(
    private renderer : Renderer2,
    private el : ElementRef,
    private productService:ProductService,
    private settings:Settings){
    this.baseURI=this.settings._defaults['apiEndPoint'];
  }


  /**
   * functions related to description_short
   */
  /**
   * En el inicio de la pagina, recupera la description_short del server y le paso el valor a la funcion
   * rendererDescriptionShort.
   * Utiliza un servicio denominado getDescription_short que necesita como parametro el id del producto
   * Se utilizan promises para que la aplicacion espere la respuesta del servidor y no pase el parametro como null y todo casque
   */
  ngOnInit(){
    let promiseContent =this.productService.getDescriptionShort();
    promiseContent.then(
      (val)=>{
        this.rendererDescription_short(val);
      }
    );
  }

  /**
   * Esta funcion reescribe los links ya que estan apuntando a una ruta relativa
   * en el servidor que no se encuentra en la aplicacion.
   * Mediante unos for que comprueban los elementos internos con el nombre de clase "cont-pdf"
   * una vez que ha encontrado los elementos pasa el valor a otra funcion
   * denominada rewritelink que reescribe el link para apuntar a la ruta externa correcta
   * @param description_short este parametro es el html que ha encontrado la app al iniciar esta pagina (ngOnInit)
   */
  rendererDescription_short(description_short){
    this.el.nativeElement.innerHTML=description_short;
    let elNodes:any=this.el.nativeElement.childNodes;
    //traveling trough DOM, pretty prone to error if anything change, so stick with the conventions
    for(let innerNode of elNodes){
      if (innerNode.className=="cont-pdf"){
        let pdfNodes:Array<Node>=innerNode.childNodes;
        for (let innerPdfNode of pdfNodes){
          this.rewriteLink(innerPdfNode);
        }
      }
    }
    console.log("la description short final es algo asi"+ this.el.nativeElement.innerHTML);
  }

  /**
   * Esta funcion reescribe los links para que apunten a la direccion correcta
   * es bastante personalizada y si algo cambio puede ser problematico
   * @param {Node} htmlNode esta funcion esta tipada como Node que es un objeto html
   * para poder usar funciones avanzadas de edicion de HTML
   */
  rewriteLink(htmlNode:Node){
    //rewriting link from internal (../../) to external (www.pmaproduct.com)
    let rewritedLink:string= htmlNode.attributes[0].value;
    //este substr quita las primeras 6 letras que son (../../)
    rewritedLink= rewritedLink.substr(6);
    rewritedLink= this.baseURI+rewritedLink;
    htmlNode.attributes['href'].value=rewritedLink;
    //rewriting img src to internal (../) to external (www.pmaproduct.com)
    let rewritedImgSrc=htmlNode.childNodes[0].attributes['src'].value;
    //este substr quita las 3 primeras letras que son (../)
    rewritedImgSrc=rewritedImgSrc.substr(3);
    rewritedImgSrc=this.baseURI+rewritedImgSrc;
    htmlNode.childNodes[0].attributes['src'].value=rewritedImgSrc;
  }
}
