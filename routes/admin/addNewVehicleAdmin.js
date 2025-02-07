var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Vehicle';
var template = './views/addNewVehicleAdmin.ejs';
var fs = require('fs');
var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });
var ContactID = 0;
var ContactName="";
var CompanyID = 0;
exports.show=function (request,response)
{

    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in Vehicle');
    }
    else{
    ContactID = request.query.ContactID;
    ContactName = request.query.ContactName;
    CompanyID =request.params.id;
    console.log("CompanyIDDDD   "+request.params.id);
    if(request.query.error!=undefined){
        response.render('addNewVehicleAdmin',{title:title, CompanyID:CompanyID,ContactID:ContactID,ContactName:ContactName,error:request.query.error});
    }
    else{
      response.render('addNewVehicleAdmin',{title:title, CompanyID:CompanyID,ContactID:ContactID,ContactName:ContactName});
    }
}
}

exports.handle_Input=function (request,response)
{
    

    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{

    var Year = request.body.Year;
    var Model = request.body.Model;
    var Make =request.body.Make;
    var VIN = request.body.VIN;
    var UnitNumber = request.body.UnitNumber;
    var ContactID = request.query.ContactID; 
    var CompanyID= request.params.id;
    var Contactname = request.query.ContactName;
    var CompanyName = request.query.CompanyName;
     var MaxVehicleID = 0;
    title = "Input Vehicle";
    
    

    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                     
                         //First Let's check if the VIN is already in the Database.
                        var VINquery=VIN+'%'
                        var checkVehicle = "select (SELECT Count(*) FROM Hunsicker.Vehicle where VIN Like "+connection.escape(VINquery)+" and CompanyID !="+connection.escape(CompanyID) +" ) as count1, (Select count(*) FRom Hunsicker.Vehicle where VIN Like "+connection.escape(VINquery)+" and CompanyID = "+connection.escape(CompanyID)+" And UnitNumber = "+connection.escape(UnitNumber)+ " ) as count2, (Select count(*) from Hunsicker.Vehicle where VIN Like "+connection.escape(VINquery)+" and CompanyID = "+connection.escape(CompanyID)+" And UnitNumber != "+connection.escape(UnitNumber) +") as count3";
                        //console.log(checkVehicle);
                        //if count1 >=1 means there are more than one this kind of vehicle in the database and they belong to different company. Either update or abandon.
                        //if count2>=1, that means the records is
                        //if count 3 >=1 means we should insert because the trucknumber is different.
                        connection.query(checkVehicle,function(err,rows){
                                         
                                         if(!err ) {
                                         if (rows[0].count1>=1)//
                                         {
                                         //here we redirect
                                        // console.log("11111111111111111");
                                         response.redirect('/addNewVehicleAdmin/'+CompanyID+'?AbandonOrUpdate=1&ContactID='+ContactID+'&ContactName='+ContactName);
                                         }
                                         else if(rows[0].count2>=1){
                                        //console.log('2222222222222222222222222222');
                                         var errorM= 'This Vehicle has already been inserted';
                                          response.redirect('/addNewVehicleAdmin/'+CompanyID+'?AbandonOrUpdate=1&ContactID='+ContactID+'&ContactName='+ContactName+'&error=errorM');
                                         }
                                         else{
                                         var count3_temp =rows[0].count3;
                                        // console.log("333333333333333333333");
                                         var findLargestVehicleID = "Select Max(VehicleID) AS solution from Vehicle;";
                                         
                                         connection.query(findLargestVehicleID,function(err,rows){//First, found the largest CompanyID;
                                                          
                                                          if(!err) {
                                                          if(rows[0]!=null)
                                                          {
                                                          //console.log('maxID rows is :'+rows[0]);
                                                          MaxVehicleID= rows[0].solution+1;
                                                  
                                                          
                                                          var VIN1='';
                                                           //--------------------------------------------------------------------------------------------------------------
                                                          if(count3_temp>=1){
                                                          VIN1=VIN+'_'+MaxVehicleID;
                                                          }
                                                          else {
                                                          VIN1=VIN;
                                                          }
                                                          
                                                          var insert="INSERT INTO Vehicle Set ? ";
                                                          
                                                          var VehicleInput = {VehicleID: MaxVehicleID, VIN:VIN1,UnitNumber:UnitNumber,VehicleMake:Make,VehicleModel:Model, CompanyID: CompanyID, VehicleYear:Year};
                                                          //console.log(VehicleInput);
                                                          connection.query(insert, VehicleInput ,function(err,rows){
                                                                           connection.release();
                                                                           if(!err ) {
                                                                           //we sucessfully input the data into Vehicle ,then we should take care of the Engine Info
                                                                           console.log('Jump to Last page');
                                                                           jumpToChoose(request,response,VIN,CompanyID,ContactID,Contactname,CompanyName);
                                                                           }
                                                                           else{
                                                                           //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                                                                           //Here should check the ContactID and ContactName is passed correct to the next page.
                                                                           var error='failed_insertion';
                                                                           response.redirect('/addNewVehicleAdmin/'+CompanyID+'?ContactID='+ContactID+'&ContactName='+ContactName+'&error='+error);
                                                                           //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

                                                                           }
                                                                           });
                                                          
                                                          }
                                                          else{console.log("error in finding max VehicleID" );
                                                          response.redirect('/addNewVehicleAdmin/'+CompanyID+'?AbandonOrUpdate=1&ContactID='+ContactID+'&ContactName='+ContactName+'&error=Error in finding max VehicleID');
                                                          }
                                                          }//end if(!err) around line 304
                                                          else{
                                                          fs.readFile(template, function(err, data) {
                                                                      
                                                                      var output = ejs.render(data.toString(), {title:title,CompanyID:CompanyID,errorMessage:'Something Error in find Max VehicleID'});//,urlLink:url});
                                                                      response.setHeader('Content-type', 'text/html');
                                                                      response.end(output);
                                                                      });}});}}
                                         
                                         //-----------------------------------------------------------------------------------------
                                         //something error in queryClause
                                         else{
                                         fs.readFile(template, function(err, data) {
                                                     

                                                     var output = ejs.render(data.toString(), {title:title,CompanyID:CompanyID,errorMessage:'Something Error in Select specific Vehicle Count'});//,urlLink:url});
                                                     response.setHeader('Content-type', 'text/html');
                                                     response.end(output);
                                                     });
                                         }
                                         
                                         });
                        connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
    
    

}
}


function jumpToChoose(req,res,VIN1,CompanyID,ContactID,Contactname,CompanyName){
    
    var dataForShowing1=new Array();

  
    
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        var countVehicle=0;
                        var VIN;
                        var VehicleID;
                        var queryClause2 = "Select x.count as countVehicle , VIN as VIN, VehicleID as vid, UnitNumber as un, VehicleMake as vmake, VehicleModel as vmodel, VehicleYear as vy From Vehicle , (select count(*) as count FROM Vehicle Where CompanyID =" + connection.escape(CompanyID) +") as x where Vehicle.CompanyID =" + connection.escape(CompanyID) +" Order by VIN ";
                        // console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].countVehicle!=undefined){
                                         countVehicle = rows[0].countVehicle;
                                         VIN = new Array(countVehicle);
                                         VehicleID = new Array(countVehicle);
                                         for(var i =0; i <countVehicle ; i++)
                                         {
                                         if (rows[i]!=null && rows[i].vid!= undefined)
                                         {
                                         
                                         
                                         dataForShowing1[i]=new Array(6);
                                         VehicleID[i]=rows[i].vid;
                                         VIN[i]=rows[i].VIN;
                                         //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                         // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                         //console.log("");
                                         dataForShowing1[i][0]=rows[i].VIN;
                                         
                                         dataForShowing1[i][1]=rows[i].vid;
                                         dataForShowing1[i][2]=rows[i].un;
                                         dataForShowing1[i][3]=rows[i].vmake;
                                         dataForShowing1[i][4]=rows[i].vmodel;
                                         dataForShowing1[i][5]=rows[i].vy;
                                         
                                         
                                         }
                                         
                                         else{console.log("no Vehicle records");
                                         //Jump to add vehicle page;
                                         res.redirect('/addNewVehicleAdmin/'+CompanyID+'?ContactID='+ContactID+'&ContactName=' +ContactName);
                                         }
                                         
                                         }
                                         // console.log('CompanyCount = ' + countCompanyID);
                                         //;console.log(CompanyID);
                                         //console.log(VIN1);
                                         res.render('chooseExistingVehicle', {h1:'Select Vehicle',use:{username:'Administrator'},title:'The result of all Vehicle',VehicleCount:countVehicle,VehicleID:VehicleID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,username:ContactName,CompanyID:CompanyID,selectedVIN:VIN1,CompanyName:CompanyName});
                                         }
                                         else{
                                         //Jump tp add new vehicle because there is no vehicle records here.
                                         res.redirect('/addNewVehicleAdmin/'+CompanyID+'?ContactID='+ContactID+'&ContactName=' +ContactName);
                                         }
                                         }
                                         
                                         else{
                                         console.log('error in Select Vehicle Info!');
                                         
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Vehicle Infomation',title:"Error in Select VehicleInfo",errorMessage :'Error in Select Vehicle Info!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        });

   }
