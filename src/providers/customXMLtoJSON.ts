/**
 * I want a custom helper because I can
 */
import { Injectable } from '@angular/core';


export class JSONtoXML{
  private XMLParsed:string;
  constructor(){//dangerous any

  }

  /**
   *
   * @param object gets an JSON object and parse as a XML string
   * @returns {string} returned as string, because is just gonna be a POST body
   */
  parseJSON(object:any){



    //waht to do?
    //get json
    //iterate trough properties
    //create xml nodes
    //don't forget the headers!
    for(var item in object){
      console.log(item.toString()+item.length);
      //if item.length!=0 then it have more levels
      /*if (item.length!=0){
        this.parseJSON(item);
      }
      else{
        this.XMLParsed+=item.toString();
      }*/
    }

    return this.XMLParsed;
  }
}
