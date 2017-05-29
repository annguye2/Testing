

// Domains variables
const app_domain = 'http://localhost:8000/';
const api_domain = 'http://localhost:3000/';

//==================Angular app controller ================
const app = angular.module('GopApp', []);

app.controller('UserController', ['$http', function($http,$window){
  // local variable;
  this.disableUserSection = true;
  this.currentUser = {};
  this.displayUser = new Object;

  //********************check localStorage**************
  if(localStorage.getItem('currentUser')!= undefined){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
    this.displayUser = this.currentUser;
  }
  //******************** Create User**************
  this.createUser = (registerUser) => {
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
          setTimeout(function() {document.getElementById('register-close-button').click()}, 0);
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
          this.disableUserSection = false;
        }else {
          this.failedLoginMsg = response.data.message + "! wrong username or password";
          console.log("failed login: ", this.failedLoginMsg);
        }
      })
    }
    userPass.username='';
    userPass.password='';
  };

  //********************* Update Profile *************
  this.updateProfile = () => {
    console.log('update user profile:');
    this.updateErrorMsg = '';
    if ((this.currentUser.name == "" || this.currentUser.name == undefined)){
      this.updateErrorMsg = "missing user's name";
      return;
    }
    if ((this.currentUser.password == "" || this.currentUser.password == undefined))
    {
      this.updateErrorMsg = "missing password";
      console.log('missing password');
      return;

    }
    if ((this.currentUser.email == "" || this.currentUser.email == undefined)){
      this.updateErrorMsg = "missing email";
      console.log('missing email');
      return;
    }
    else{
      console.log('allowed to update ', JSON.parse(localStorage.getItem('currentUser')).token);
      $http({ // Makes HTTP request to server
        method: 'PUT',
        url: api_domain + '/users/' + this.currentUser.id,
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token
        },
        data: {
          name:      this.currentUser.name,
          password:  this.currentUser.password,
          email:     this.currentUser.email,
        }
      }).then(function(response){
        if(response.data !='' || response.data != undefined){
          console.log("user update success");
          this.displayUser = this.currentUser;
          setTimeout(function() {document.getElementById('update-close-button').click()}, 0);
        }
        else{
          this.updateErrorMsg = "Unauthorized to update"
        }
      })
    }
  }; //end of update profile
  //******************** Set Local Storage ***********
  this.setLocalStorage = (data) => {
    if(data){
      // Put the object into storage
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
      this.displayUser = this.currentUser;
    }
  }
  //******************** User logout********************
  this.logout = () => {
    console.log('logout');
    localStorage.clear();
  };



}]); // end of user controller




//=======================================================ESRI controller
app.controller('EsriController',['$http', function($http){

  this.disableCreateProjectSection = true;
  this.basemapGallery =[
    { value: "streets", label: "Streets Map" },
    { value: "topo", label: "Topographic" },
    { value: "hybrid", label: "World Imagery" },
    { value: "dark-gray", label: "Dark Gray Canvas" },
    { value: "satellite", label: "Satellite" },
    { value: "oceans", label: "Oceans" }];
  this.featureServices = [];
  this.projects        = [];

    //******************** get all available feature URL**************
    this.getFeatureUrl = () => {
      $http({
        method: 'GET',
        url: api_domain + '/features'
      }).then(result =>{
        this.featureServices = result.data;
      });
    };

    //************ loading feature URL ****************************
    this.getProjects = () => {
      $http({
        method: 'GET',
        url: api_domain + '/projects'
      }).then(result => {
        this.projects = result.data;
        console.log('all projects', this.projects);
      });

    };

    //****************Enable Create Project Section*****************
    this.enableCreateProjectSection = () => {
      this.disableCreateProjectSection = false;

    }
    //************ Create Project*********************************
    this.createProject = (createData) => {



      // 1. create new feature service data  then add to database and get the ID on response back
      // 2. create a project, add to projects table and get. id response back

      // 3. create a linktabe item with  feature_id, project_d, user_id, then insert in to linktable.


      createData.user_id = 2;
      console.log('get create data ', createData);
      $http({
        method: 'POST',
        url: api_domain + '/projects',
        data: createData
      }).then(result => {
        console.log('result form create new projects', result);
      });






    }


    //******************* get all data ******************************
    this.getFeatureUrl(); // get available featureServices
    this.getProjects();
    //console.log(JSON.parse(localStorage.getItem('currentUser')).user.name);
}]); // end of EsriController
