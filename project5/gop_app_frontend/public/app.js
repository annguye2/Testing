
var TEST = ''
const app_domain = 'http://localhost:8000/'
const api_domain = 'http://localhost:3000/'
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http){

  this.welcomeMsg = "Welcome to Gospatial online app"
  this.projects = "";


 TEST = this.welcomeMsg ;
//******************** get all available feature URL**************
this.getFeatureUrl = function (){
  $http({
    method: 'GET',
    url: api_domain + '/features'
  }).then(function(result){
    this.projects = result.data;
    console.log(this.projects);
  }.bind(this));
};

//******************** create User**************
this.createUser = function(){
  this.username = "vv";
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
  }).then(function(response){
      console.log(response);
  }.bind(this));
};
//******************** User Login**************
this.login = function(){
  this.username = "vv";
  this.password = "pass123";
  $http({
    method: "POST",
    url   : api_domain + "users/login",
    data:{
      username: this.username,
      password: this.password
    }
  }).then(function(response){
      console.log(response);
  }.bind(this));
};

//************ Testing section **********
// createUser();    //worked
this.getFeatureUrl(); //worked

// this.login();








}]); // end of controller


console.log("this is TEST", TEST);
