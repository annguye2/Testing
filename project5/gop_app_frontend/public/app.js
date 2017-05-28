
// Domains variables
const app_domain = 'http://localhost:8000/';
const api_domain = 'http://localhost:3000/';

//==================Angular app controller ================
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http){

  //******************** Create User**************
  this.createUser = function(registerUser){
    console.log('registerUser username is missing :', registerUser.username);
    if((registerUser.name == '') ||(registerUser.name == undefined)){
      this.registerErrorMsg = "User's name is missing";
      // console.log('missing name ; ', this.registerErrorMsg);
    }
    else if ((registerUser.username == '') || (registerUser.username == undefined)){
      this.registerErrorMsg = "username is missing";
      // console.log('mising username ; ', this.registerErrorMsg);
    }
    else if((registerUser.password == '') || (registerUser.password == undefined)){
      this.registerErrorMsg = "password is missing";
      // console.log('missing password ; ', this.registerErrorMsg);

    }else{
      console.log('Creating new User ; ', this.registerErrorMsg);
      $http({
        method: "POST",
        url   : api_domain + "users",
        data:{
          name    : registerUser.name,
          username: registerUser.username,
          email   : registerUser.email,
          password: registerUser.password
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
    }
    registerUser = {};

  };// end of createUser

  //******************** User Login**************

  this.login = function(userPass){
    this.sucessfulLoginMsg ='';
    this.failedLoginMsg    ='';
    if (!userPass) {
      this.failedLoginMsg = "Missing username/password";
    }else {
      $http({
        method: "POST",
        url   : api_domain + "users/login",
        data:{
          username: userPass.username,
          password: userPass.password
        }
      }).then(response =>{
        console.log(response);
        if(response.data.status == 200){
          this.sucessfulLoginMsg = response.data.message
          console.log("success login: ", this.sucessfulLoginMsg);
        }else {
          this.failedLoginMsg = response.data.message + "! wrong username or password";
          console.log("failed login: ", this.failedLoginMsg);
        }
      })
    }
    userPass = {};
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
