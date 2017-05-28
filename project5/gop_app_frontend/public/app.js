

// Domains variables
const app_domain = 'http://localhost:8000/';
const api_domain = 'http://localhost:3000/';

//==================Angular app controller ================
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http,$window){
  // local variable;
    // this.showUserLogin    = false;
    // this.showUserRegister = false;
    // this.showUserUpdate   = false;
    this.currentUser = {};

  //********************check localStorage**************
     if(localStorage.getItem('currentUser')!= undefined){
       this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
     }
  //******************** Create User**************
  this.createUser = function(registerUser){
    this.registerErrorMsg = '';
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
       console.log('register User info ; ', registerUser);
       var userPass ={};
       userPass.username = registerUser.username;
       userPass.password = registerUser.password;
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
        console.log("create sucess");
        if(response.data.status!=204){
          this.createUserSuccessMsg = "Create User Success"
          this.login(userPass);
          this.showLogin != this.showLogin;
        }
        else {
            this.registerErrorMsg = response.data.message //msg set from API
        }
      })
    }
    registerUser = '';

  };// end of createUser

  //******************** User Login**************


  this.login = (userPass) => {
    console.log('log in from register  userPass:', userPass );
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
        // console.log("response from log in ", response);
        if(response.data.status == 200){
          console.log('login success');
          this.sucessfulLoginMsg = response.data.message;
          this.projects = response.data.projects;
          this.setLocalStorage(response.data); //store createUser information to localStorage
          setTimeout(function() {document.getElementById('login-close-button').click()}, 0);
        }else {
          this.failedLoginMsg = response.data.message + "! wrong username or password";
          console.log("failed login: ", this.failedLoginMsg);
        }
      })
    }
    userPass.username='';
    userPass.password='';
  };

  //*******************set time out *******************

 //******************** get Current User Data ***********
 // this.loadProfile = function(){
 //   console.log('loading user profile by id: ', localStorage.getItem('userId'));
 //   $http({ // Makes HTTP request to server
 //     method: 'GET',
 //     url: api_domain + 'user/' + localStorage.getItem('userId') + '/projects',
 //     headers: {
 //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
 //     }
 //   }).then(response => {
 //     if(response.data.status == 401) {
 //       this.error = "Unauthorized";
 //     } else {
 //       console.log("current user info: ", response.data);
 //     }
 //   });
 // }
//********************* Update Profile *************
this.updateProfile = function(updateUser){

  if ((updateUser.name == "" || updateUser.name == undefined) ||
  (updateUser.password == "" || updateUser.password == undefined))
  {
    console.log(" invalid input ");
    this.updateErrorMsg = "missing username/password";
  }
  else{
    console.log('alow to update ');
    // $http({ // Makes HTTP request to server
    //   method: 'PUT',
    //   url: api_domain + '/users/' + localStorage.getItem('userId'),
    //   headers: {
    //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    //   },
    //   data: {
    //     name:      this.playerProfile.name,
    //     password:  this.playerProfile.password,
    //     email:     this.playerProfile.email,
    //   }
    // }).then(function(response){
    //   console.log("user response", response);
    //   window.location.href="/"
    // })
  }
}; //end of update profile
 //******************** Set Local Storage ***********
 this.setLocalStorage = function(data) {
  //  console.log('set local storage data: ', data);
   if(data){
     // Put the object into storage
     localStorage.setItem('currentUser', JSON.stringify(data));
     this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;

   }
 }
  //******************** User logout********************
  this.logout = function(){
    console.log('logout');
    localStorage.clear();
    };
}]); // end of user controller



//=======================================================ESRI controller
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
      // console.log(this.featureServices);
    }.bind(this));
  };

//
  //************ loading feature URL ****************************
 this.getFeatureUrl();


}]); // end of EsriController
