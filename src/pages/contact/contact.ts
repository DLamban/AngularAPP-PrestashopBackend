import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
 
declare var google: any;

 
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController) {
 
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
 
    let latLng = new google.maps.LatLng(41.647967, -0.874149);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }
 
}