import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

/* import { ProductsPage } from '../productos/productos';*/ //this is getting old
import { ContactPage } from '../contact/contact';
import { ServicesPage } from '../services/services';
import { CategoriesPage } from '../categories/categories';
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';


import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

 // rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController) {
    // used for an example of ngFor and navigation

  }



  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
