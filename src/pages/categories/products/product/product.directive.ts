import { Directive, ElementRef, Renderer2  } from '@angular/core';

@Directive({ selector: '[internalToExternal]'})
export class RewriteLinkDirective {
  private nativeElement:Node;
  constructor( /*private renderer : Renderer2, private el : ElementRef*/){
    //puto amo, pero no estaria mal cambiar las directivas por un componente que lo crease desde 0 para evitar posibles xss hacks
    //quizas no, porque si intento crear de 0 tengo enormes problemas incluyendo infiernosos problemas de asincronia y variables
    //sin inicializar. necesito un poco de paz por diox
    /*this.nativeElement=el.nativeElement;
    let internalLink:any= this.nativeElement.attributes;
    console.log(internalLink['href']);
    this.renderer.setAttribute(this.nativeElement,"href","http://www.google.es");*/
  }

}
