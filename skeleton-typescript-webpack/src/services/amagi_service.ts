import {autoinject} from 'aurelia-framework';
const fetch = require('isomorphic-fetch');

@autoinject()
export class AmagiService{

  /*Instance variable init*/


  constructor(){

  }

  getAmagiVideoList(){
    return fetch('https://amagi.herokuapp.com/ui-test/api/v1/spots')
      .then( response => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(response => response);
  }



}
