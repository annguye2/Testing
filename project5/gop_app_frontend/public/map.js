require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/dijit/Search",
  "esri/InfoTemplate",
  "dojo/domReady!"
],
function(
  Map,
  FeatureLayer,
  QueryTask,
  Query,
  Search,
  InfoTemplate,
  PopupTemplate
) {
  var  basemapSelector ;
  var featureLayerUrl;
  var currentLayer;
  //*********************** Loading map  ***********************
  // console.log('map is loading..');
  var map = new Map("map", {
    basemap:"streets",
    //center: [-97.380979, 42.877742],  //central us
    // center: [-77.871094, 37.439974],  // central virginia
    center: [-77.0369, 38.9072, ],
    zoom: 10
  });
  //*********************** add serch bar  ***********************
  var search = new Search({
    map: map
  }, "search");
  search.startup();  // add search bar
  // *********** change base map on drop down select **********
  $("#basemapSelector" ).change(function() {
    // $("#basemapSelector").find("option:selected").text();
    map.setBasemap($("#basemapSelector").find("option:selected").val())
  });

  //************************ featureServiceSelector ***********
  $("#featureServiceSelector" ).change(function() {
     featureLayerUrl= $("#featureServiceSelector").find("option:selected").val();
  });

  //************************ removeLayer *********************
  $('#removeLayer').click(function(){
    removeLayer();
  });
 //************************ add layer event *******************
 $("#addLayer").click(function(){
   console.log("url : ", featureLayerUrl);
     addFeatureLayer(featureLayerUrl);
 });

document.getElementById("create-project").disabled = "disabled";

  $("#create-project").children().prop('disabled',true);
 console.log('after disable');
  // //******************* build popup info ****************
  // var buildPopUpInfor = function(url){
  //   var tempFeatureLayer = new FeatureLayer(url);
  //   var template = new InfoTemplate();
  //   tempFeatureLayer.on("load", function () {
  //     template.setTitle("<b>" + tempFeatureLayer.name + "</b>");
  //   });
  // }

 //******************* add FeatureLayer ****************
 var addFeatureLayer = function (url){
   if(url) {
     console.log('add layer: ');
     var tempFeatureLayer = new FeatureLayer(url);
     var template = new InfoTemplate();
     tempFeatureLayer.on("load", function () {
       template.setTitle("<b>" + tempFeatureLayer.name + "</b>");
     });
     var featureLayer = new FeatureLayer(url,{
       mode: FeatureLayer.MODE_ONDEMAND,
       infoTemplate: template,
       outFields: ['*'],
       opacity: 1,
       visible: true
     });
     map.addLayer(featureLayer);  // add layer
     map.refresh;
     currentLayer = featureLayer;
   }
   else {  console.log("There's no url");}

 }
  //******************* remove FeatureLayer ****************
 var removeLayer = function(){
   if(currentLayer){
     console.log('remove current layer: ', map);
      map.removeLayer(currentLayer);
      map.refresh;
   }else{console.log('no layer to remove');}

 }
  //************************ Read data**************************************
  //
  var readData = function (){
    //var dataUrl = "https://services2.arcgis.com/1cdV1mIckpAyI7Wo/arcgis/rest/services/Hurricane_Evacuation_Routes/FeatureServer/0?f=pjson"
    // $.getJSON(DOMAIN + 'arcgis/rest/services/WebIMT_GP_UCI_Capacity/UCICapacityTool/GPServer/UCI_Capacity_Query?f=pjson&callback=?', function (data) {
    $.getJSON('https://services2.arcgis.com/1cdV1mIckpAyI7Wo/ArcGIS/rest/services?f=pjson&callback=?', function (data) {
      //console.log("this is hurican data: ", data.services);
      for (var i = 0; i < 5; i ++) {
        console.log("this datatype", data.services[i].type);
        console.log("this name", data.services[i].name);
        console.log("this url", data.services[i].url + "/0");

      }
    });
  };// end of read data function

  //********** testing ******************
  //readData();
  //******** end testing section ********
});// end ESRI require
