
// Domains variables
const app_domain = 'http://localhost:8000/';
const api_domain = 'http://localhost:3000/';

//==================Angular app controller ================
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http){

  //******************** Create User**************
  this.createUser = function(){
    console.log('Creating new User ');
    this.username = "szzxz";
    this.password = "pass123";
    this.email    = "vvemail@gmail.com";
    this.name     = "Full Name";
    $http({
      method: "POST",
      url   : api_domain + "users",
      data:{
        name    : this.name,
        username: this.username,
        email   : this.email,
        password: this.password
      }
    }).then(response => {
      console.log(response);
      if(response.data.message){
        this.createUserMsg = response.data.message //msg set from API
        console.log(this.createUserMsg);
      }
      else {
        this.createUserSuccessMsg = "Create User Success"
        console.log(this.createUserSuccessMsg);
      }
    })

  };// end of createUser

  //******************** User Login**************

  this.login = function(){
    this.username = "xx";
    this.password = "pass123";
    $http({
      method: "POST",
      url   : api_domain + "users/login",
      data:{
        username: this.username,
        password: this.password
      }
    }).then(response =>{
      console.log(response);
      if(response.data.status == 200){
        this.sucessfulLoginMsg = response.data.message
      }else {
        this.failedLoginMsg = response.data.message
      }
    })
  };

  //******************** User logout**************
  this.logout = function(){
    console.log('logout');
    //$localStorage.$reset();
    window.location.href='/';
  };
}]); // end of user controller


app.controller('EsriController',['$http', function($http){
   this.greetingMsg = "Hello from ESRI controller "
  // build basemaps
   this.basemapGallery =[
     { value: "streets", label: "Streets Map" },
     { value: "topo", label: "Topographic" },
     { value: "hybrid", label: "World Imagery" },
     { value: "dark-gray", label: "Dark Gray Canvas" },
     { value: "satellite", label: "Satellite" },
     { value: "oceans", label: "Oceans" }];
   this.featureServices =

  //******************** get all available feature URL**************
  this.getFeatureUrl = function (){
    $http({
      method: 'GET',
      url: api_domain + '/features'
    }).then(function(result){
      this.featureServices = result.data;
      console.log(this.featureServices);
    }.bind(this));
  };

//
  //************ loading feature URL ****************************
 this.getFeatureUrl();


}]); // end of EsriController
