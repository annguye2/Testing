
var TEST = ''
console.clear();
const app_domain = 'http://localhost:8000/'
const api_domain = 'http://localhost:3000/'
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http){

  //this.welcomeMsg = "Welcome to Gospatial online app"
  //this.projects = "";


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
// this.login = function(){
//   this.username = "a";
//   this.password = "pass123";
//   $http({
//     method: "POST",
//     url   : api_domain + "users/login",
//     data:{
//       username: this.username,
//       password: this.password
//     }
//   }).then(function(response){
//       console.log(response);
//   }.bind(this));
// };
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
//************ Testing section **********
// createUser();    //worked
//this.getFeatureUrl(); //worked
//this.createUser();

this.login();








}]); // end of controller


console.log("this is TEST", TEST);
