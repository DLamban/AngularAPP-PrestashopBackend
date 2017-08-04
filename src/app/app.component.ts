import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
//importing the pages
/*import { ProductsPage } from '../pages/productos/productos';  */ //this is getting old
import { ContactPage } from '../pages/contact/contact';
import { ServicesPage } from '../pages/services/services';
import { MenuPage } from '../pages/menu/menu';
import {SearchPage } from '../pages/search/search';
import { CategoriesPage} from '../pages/categories/categories';
import { HomePage } from '../pages/home/home';
import { ProductsPage } from '../pages/categories/products/products';
import { ProductPage } from '../pages/categories/products/product/product';
import { LoginPage } from '../pages/login/login';
//adding deploy
import {Deploy} from '@ionic/cloud-angular';


import { Settings } from '../providers/providers';

import { TranslateService } from '@ngx-translate/core'
import {SignupPage} from "../pages/signup/signup";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {CartPage} from "../pages/cart/cart";

@Component({
  template:
  `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menú</ion-title>
      </ion-toolbar>
    </ion-header>pages

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage : any;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [

 /* { title: 'Productos', component: ProductsPage },*/ //this is getting old
  { title: 'Servicios', component: ServicesPage },
  { title: 'Contacto', component: ContactPage },
  { title: 'Cesta', component: CartPage},
  //{ title: 'Categorias', component: CategoriesPage },
  { title: 'Inicio', component:HomePage },
  { title: 'Busqueda', component:SearchPage},
 // { title: 'Productos' , component:ProductsPage}

  //{ title: 'Identificarse', component: LoginPage },
  //{ title: 'Registrarse', component: SignupPage },

  ];

  constructor ( private storage:Storage,private translate: TranslateService, private platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    this.initTranslate();
    //remember to erase this line or you're fucked
    this.storage.clear();

    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = TutorialPage;
        }
       // this.platformReady()
      });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('es');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('es'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
