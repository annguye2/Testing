
// Domains variables
const app_domain = 'http://localhost:8000/';
const api_domain = 'http://localhost:3000/';

//==================Angular app  ================
const app = angular.module('GopApp', []);

//***********************************************************
            //  USER Controller
//===========================================================
app.controller('UserController', ['$http', '$scope','$rootScope',function($http,$scope,$rootScope){

  // local variable;
  this.disableUserSection = true;
  this.disableEditSection = true;
  this.currentUser = {};
  this.displayUser = new Object;
  this.currentUserProjects = [];
  this.loginRequired = true;
  //********************check localStorage**************
  if(localStorage.getItem('currentUser')!= undefined){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
    this.displayUser = this.currentUser;
    this.disableUserSection = false;
    this.disableEditSection = false;
  }
  //******************** Create User*************
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
    // console.log('log in from register  userPass:', userPass );
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
          this.currentUserProjects = response.data.projects;  // get current user project
          $rootScope.currentUserProjects = this.currentUserProjects;
          console.log('Usercontroll: current user project: ' , this.currentUserProjects);
          this.setLocalStorage(response.data); //store createUser information to localStorage
          setTimeout(function() {document.getElementById('login-close-button').click()}, 0);
          this.loginRequired = !this.loginRequired;
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

  //********************* Update Profile **********
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
  //******************** Set Local Storage ********
  this.setLocalStorage = (data) => {
    if(data){
      // Put the object into storage
      localStorage.setItem('loginSuccess', true);
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
      this.displayUser = this.currentUser;
    }
  }
  //******************** User logout****************
  this.logout = () => {
    console.log('logout');
    localStorage.clear();
  };

  //******************** Enable Edit Section********
  this.enableEditSection = () =>{
    console.log('enable edit');
    this.disableEditSection = false;
  }

}]); // end of user controller

//***********************************************************
            //  ESRI Controller
//===========================================================
app.controller('EsriController',['$http', '$scope','$rootScope',function($http,$scope,$rootScope){
  console.log(" ESRI controller ***********************");

    this.disableCreateProjectSection = true;
    this.basemapGallery =[
      { value: "streets",   label: "Streets Map" },
      { value: "topo",      label: "Topographic" },
      { value: "hybrid",    label: "World Imagery" },
      { value: "dark-gray", label: "Dark Gray Canvas" },
      { value: "satellite", label: "Satellite" },
      { value: "oceans",    label: "Oceans" }];
    this.featureServices = [];
    this.selectedProjectId;

    //******************** ESRI Save Map to Project********************
    this.createProjectFromMap = (selectedFeature) => {
      console.log(selectedFeature);
      if(localStorage.getItem('loginSuccess')!= null || localStorage.getItem('loginSuccess')!= undefined){
        if(selectedFeature){
          this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
          var createData = {}
          createData.name         = selectedFeature.title;
          createData.feature_url  = selectedFeature.url;
          createData.category     = selectedFeature.data_type;
          createData.comment      = "";
          createData.user_id      = this.currentUser.id;
          createData.description  = "";
          this.addUserProjects(createData);
          this.selectFeatureRequireMsg ='';
          this.loadCurrentUserProjects();
        }else {
          this.selectFeatureRequireMsg = "You must select a feature above";
        }

      }else {
        this.requiredLoginMsg = "Login required!";
      }

    }

    //******************** ESRI resetSelectFeatureeRequireMsg L**********
    this.resetSelectProjectRequireMsg = (selectedprivateProject) =>{
      if(selectedprivateProject){
        console.log('ng-change');
        this.selectProjectRequireMsg = '';
      }
      else{
        console.log('invalid selected Project');
      }
    }

    //******************** ESRI resetSelectFeatureeRequireMsg L**********
    this.resetSelectFeatureeRequireMsg = (selectedFeature) =>{
      if(selectedFeature){
        this.selectFeatureRequireMsg = '';
      }
    }

    //******************** ESRI get all available feature URL**********
    this.getFeatureUrl = () => {
      $http({
        method: 'GET',
        url:    api_domain + '/features'
      }).then(result =>{
        // console.log('seed data : ', result.data);
        this.featureServices = result.data;
        localStorage.setItem('featureServices', JSON.stringify(result.data));
      });
      // console.log('this.featureServices: ', this.featureServices);
    };

    //****************ESRI nable Create Project Section****************
    this.enableCreateProjectSection = () => {
      this.disableCreateProjectSection = false;

    }

    //************ ESRI Create Project*********************************
    this.createProject = (createData) => {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
      if (createData.shared == true) {
        console.log('add share and private project');
        this.addShareProject(createData);
        this.addUserProjects(createData);
      }else {
        this.addUserProjects(createData);
      }

    }

    //************* ESRI delete shareprojects ******************************
    this.deleteSharedProject = (deleteProject) => {
      if(deleteProject) {
        console.log('DELETE ' ,deleteProject);
        $http({
          method: "DELETE",
          url: api_domain + "shareprojects/" + deleteProject.id

        }).then(result => {
          console.log('DELTED: ', result);
          this.getSharedProjects();
        });
      }
      else{console.log('failed to delete');}
    }

    // ************* ESRI delete project ******************************
    this.deleteProject = (deleteProject) => {
      if(deleteProject) {
        console.log('DELETE ' ,deleteProject);
        $http({
          method: "DELETE",
          url: api_domain + "projects/" + deleteProject.id

        }).then(result => {
          console.log('DELTED: ', result);
          this.getUserProjects();
          this.resetEditFields();
        });
      }
      else{console.log('failed to delete');}
    }

    //// *********** ESRI LOAD  Project Edit info *********************
    this.loadProjectEditInfo = (selectedprivateProject) =>{
      console.log("selectedProject: ", selectedprivateProject);
      if(selectedprivateProject){
        // console.log("selected Project :", selectedprivateProject);
        this.selectedProjectId=selectedprivateProject.id
        this.editName         = selectedprivateProject.name;
        this.editUrl          = selectedprivateProject.feature_url;
        this.editComment      = selectedprivateProject.comment;
        this.editDescription  = selectedprivateProject.description;
        this.editCategory     = selectedprivateProject.category;
        this.resetSelectFeatureeRequireMsg();
      }else {
        this.selectProjectRequireMsg = "You must select a feature above";
      }
    }

    //// *********** ESRI LOAD  user projects  ************************
    this.editProject = () => {
      // post project to public
      if (this.editShared) {
          var createData = {};
          createData.name        = this.editName;
          createData.comment     = this.editComment;
          createData.description = this.editDescription;
          createData.catergory   = this.editCategory;
          createData.feature_url = this.editUrl
          createData.creator     = this.currentUser.name;
          this.addShareProject(createData);
      }
      //add project to userlist
      $http({
        method: "PUT",
        url: api_domain + "projects/" + this.selectedProjectId,
        data:{
          name:           this.editName,
          feature_url:    this.editUrl,
          description:    this.editDescription,
          comment:        this.editComment,
          category:       this.editCategory
        }

      }).then(result => {
          if(result){
            this.resetEditFields();
            console.log("EDIT: success");
            this.loadCurrentUserProjects();
          }
      });

    }//end edit

    //// *********** ESRI reset edit fields in user project **********
    this.resetEditFields = () =>{
      this.editName         = '';
      this.editUrl          = '';
      this.editDescription  = '';
      this.editComment      = '';
      this.editCategory     = '';
    }

    // *********** ESRI LOAD  user projects  *************************
    this.getUserProjects = () =>{
      console.log('get current user projects:');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user
      console.log('user id: ', this.currentUser.id);
      $http({
        method: "GET",
        url: api_domain + "users/" + this.currentUser.id,
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token
        },
      }).then(result => {
        this.currentUserProjects = result.data.projects;
        console.log('success: load user project');
      });
    }

    // ***********  ESRI add new private Project **********************
    this.addUserProjects = (createData) => {
      if (createData) {
        createData.user_id = this.currentUser.id;
        $http({
          method: 'POST',
          url: api_domain + "user/"+ this.currentUser.id + '/projects',
          data: {
            name:         createData.name,
            comment:      createData.comment,
            description:  createData.description,
            user_id:      createData.user_id,
            category:     createData.catergory,
            feature_url:  createData.feature_url,
          }
        }).then(result => {
          //console.log('result form create new share project', result);
          this.getUserProjects();
        });
      }else{
        console.log("can't update feature service");
      }

    }; //end add  new feature service

    // ***********  ESRI add new share Project ************************
    this.addShareProject = (createData) => {
      if (createData) {
        createData.creator = this.currentUser.name;
        $http({
          method: 'POST',
          url: api_domain + '/shareprojects',
          data: {
            name:         createData.name,
            comment:      createData.comment,
            description:  createData.description,
            category:     createData.catergory,
            feature_url:  createData.feature_url,
            creator:      createData.creator
          }
        }).then(result => {
          //console.log('result form create new share project', result);
          this.getSharedProjects(); // load all public project
        });
      }else{
        console.log("can't update feature service");
      }

    }; //end add  new feature service

    // *********** ESRI add new feature service  **********************
    this.addNewFeatureSerice = (createData) => {
      if (createData) {
        var featureService ={};
        featureService.title = createData.name;
        featureService.url = createData.feature_url;
        featureService.data_type = "FeatureServer";
        $http({
          method: 'POST',
          url: api_domain + '/features',
          data: featureService
        }).then(result => {
          //console.log('result form create new projects', result);
          this.getFeatureUrl (); //update feature service list;
        });
      }else{
        console.log("can't update feature service");
      }

    }; //end add  new feature service

    // *********** ESRI LOAD  public projects  ************************
    this.getSharedProjects = () =>{
      $http({
        method: 'GET',
        url: api_domain + '/shareprojects',
      }).then(result => {
        //console.log('All shared project', result.data);
        this.sharedProjects = result.data;
        // console.log("All shared projects :", this.sharedProjects);
      });
    };

    // *********** ESRI load  projects to map  ************************
    this.loadProjectToMap = (selectedProject, isPublic) =>{
      console.log('loading... ');
      if(selectedProject){
        console.log('LOAD project to map');
        localStorage.setItem('currentFeatureUrl', selectedProject.feature_url);
      }else{
        if(isPublic){
          this.selectSharedProjectRequireMsg = "You must select a feature above";
        }
        else{
          this.selectProjectRequireMsg = "You must select a feature above";
        }
        console.log("SELECT failed");
      }
      selectedProject={};
    };

    //******************* ESRI Reset Public Project Selection *********
     this.resetSelectSharedProjectRequireMsg = (selectedProject) =>{
       if(selectedProject){
         this.selectSharedProjectRequireMsg = "";
       }
     };

    // ************ ESRI load Current User Projects *******************
    this.loadCurrentUserProjects = () =>{
      this.getUserProjects();
    };

    // ************ ESRI Remove current layer *******************
   this.removeLayer = () =>{
     console.log('angular ');
     localStorage.removeItem("currentFeatureUrl")
     //localStorage.setItem('', "");
   }

   // ************ ESRI add Selected Feature To map *******************
   this.addSelectedFeatureToMap = (selectedFeature) =>{
     console.log('add feature to map: ', selectedFeature);
     if(selectedFeature){
        localStorage.setItem('currentFeatureUrl', selectedFeature.url)
     }else{
       console.log("Failed to select feature");
     }
   }

   // ************ ESRI Data initial loading ************************
    this.getFeatureUrl(); // get available featureServices
    this.getSharedProjects();

}]); // end of EsriController
