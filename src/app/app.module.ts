import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

//changing products to categories
import { CategoriesPage } from '../pages/categories/categories';
import { HomePage } from '../pages/home/home';
import { ProductsPage } from '../pages/categories/products/products';
import { ProductPage } from '../pages/categories/products/product/product';
import { ContactPage } from '../pages/contact/contact';
import { ServicesPage } from '../pages/services/services';
import { SearchPage } from '../pages/search/search';
//custom directive to rewrite links to external sources
import { RewriteLinkDirective } from '../pages/categories/products/product/product.directive';
import {DescriptionShort} from "../pages/categories/products/product/product.description_short";
import { ProductService} from '../pages/categories/products/product/product.service';
//legacy page imports

import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { Api } from '../providers/api';

import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//adding cloudservice for auth and pushing notifications
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

//providers
import {CartService} from "../pages/cart/cart.service";
import {XmlParser} from "@angular/compiler/src/ml_parser/xml_parser";
import {JSONtoXML} from "../providers/customXMLtoJSON";
import {Customer} from "../models/customer";
import {Cart} from "../models/cart";
import {CartPage} from "../pages/cart/cart";
import {Product} from "../models/productXML";
import {CheckCartPage} from "../pages/check-cart/check-cart";
import {PlaceOrderPage} from "../pages/place-order/place-order";

import {ApiConfigSecret} from "./config";
import {Order} from "../models/order";


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '3d60b950'
  }
};



// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export function provideSettings(storage: Storage) {

  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  let configApi=new ApiConfigSecret();
  let values:any= configApi.getConfig();
  return new Settings(storage,values);

}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  MenuPage,
  ServicesPage,
  ContactPage,
  CategoriesPage,
  HomePage,
  ProductsPage,
  ProductPage,
  DescriptionShort,
  SearchPage,
  LoginPage,
  SignupPage,
  TutorialPage,
  CartPage,
  CheckCartPage,
  PlaceOrderPage,

];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Api,
    Items,
    User,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    //my own service for product
    ProductService,
    //service for cart
    CartService,
    JSONtoXML,
    Customer,
    CartService,
    Cart,
    ApiConfigSecret,
    Order,
    //the storage service
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations:[ declarations(),RewriteLinkDirective, DescriptionShort],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule { }
