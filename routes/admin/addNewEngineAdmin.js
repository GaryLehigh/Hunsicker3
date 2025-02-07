var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Engine';
var template = './views/addNewEngineAdmin.ejs';
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
var VIN="";
var CompanyID = 0;
exports.show=function (request,response)
{

/*
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{*/

    ContactID = request.query.ContactID;
    CompanyID = request.query.CompanyID;
    VIN =request.params.id;
    
    if(request.query.error!=undefined){
        response.render('addNewEngineAdmin',{title:title, VIN:VIN,ContactID:ContactID,CompanyID:CompanyID,errorMessage:request.query.error});
    }
    else{
        response.render('addNewEngineAdmin',{title:title, VIN:VIN,ContactID:ContactID,CompanyID:CompanyID});
    }
//}
}

exports.handle_Input=function (request,response)
{
   var user = request.user;
/*
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{*/
    var Year = request.body.EngineYear;
    var Model = request.body.EngineModel;
    var Make =request.body.EngineMake;
    var VIN = request.params.id;
    var SerialNumber = request.body.EngineSerialNumber;
    
    title = "Input Engine";
    
    

    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                     
                         //First Let's check if the VIN is already in the Database.
                        var VINquery=VIN;
                        var checkEngine = "select (SELECT Count(*) FROM Hunsicker.Engine  where EngineVIN = "+connection.escape(VINquery)+" and EngineSerialNumber ="+connection.escape(SerialNumber) +" ) as count1, (Select count(*) FRom Hunsicker.Engine where EngineVIN != "+connection.escape(VINquery)+" and EngineSerialNumber = "+connection.escape(SerialNumber)+" ) as count2";
                        console.log(checkEngine);
                        //if count1 >=1 means there are more than one this kind of vehicle in the database and they belong to different company. Either update or abandon.
                        //if count2>=1, that means the records is
                        //if count 3 >=1 means we should insert because the trucknumber is different.
                        connection.query(checkEngine,function(err,rows){
                                         
                                         if(!err ) {
                                         if (rows[0].count1>=1)//
                                         {
                                         //here we redirect
                                         console.log("11111111111111111");
                                         response.redirect('/addNewEngineAdmin/'+VIN+'?CompanyID='+CompanyID+'&ContactID='+ContactID+'&error=Engine_Already_Exists');
                                         }
                                         else if(rows[0].count2>=1){
                                         console.log('2222222222222222222222222222');
                                         var errorM= 'You should abandon this insertion, update the VIN of this Engine or try another Engine Serial Number.';
                                         response.render('addNewEngineAdmin',{title:title, VIN:VIN,CompanyID:CompanyID,ContactID:ContactID,errorMessage:errorM});
                                         }
                                         else{
                                         var count3_temp =rows[0].count3;
                                         console.log("333333333333333333333");
                                         
                                                          var insert="INSERT INTO Engine Set ? ";
                                                          
                                                          var EngineInput = {EngineVIN: VIN, EngineSerialNumber:SerialNumber,EngineMake:Make,EngineModel:Model, EngineYear:Year};
                                                          console.log(EngineInput);
                                                          connection.query(insert, EngineInput ,function(err,rows){
                                                                           connection.release();
                                                                           if(!err ) {
                                                                           //we sucessfully input the data into Vehicle ,then we should take care of the Engine Info
                                                                           console.log('Jump to Last page');
                                                                           jumpToChoose(request,response,VIN,ContactID,CompanyID,SerialNumber);
                                                                           }
                                                                           else{
                                                                           //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                                                                           //Here should check the ContactID and ContactName is passed correct to the next page.
                                                                           var error='failed_insertion';
                                                                           response.redirect('/addNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID+'&error='+error);
                                                                           //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

                                                                           }
                                                                           });
                                                          
                                            }
                                         }
                                         
                                         
                                         //-----------------------------------------------------------------------------------------
                                         //something error in queryClause
                                         else{
                                         fs.readFile(template, function(err, data) {
                                                     

                                                     var output = ejs.render(data.toString(), {title:title,VIN:VIN,ContactID:ContactID,CompanyID:CompanyID,errorMessage:'Something Error in Select specific Engine Count'});//,urlLink:url});
                                                     response.setHeader('Content-type', 'text/html');
                                                     response.end(output);
                                                     });
                                         }
                                         
                                         });
                        connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
    
    

//}
}


function jumpToChoose(req,res,VIN1,ContactID,CompanyID,selectedSerialNumber){
    
    
    
    if(VIN1 !=null && VIN1!=undefined){
        var dataForShowing1=new Array();
        var CompanyID = req.query.CompanyID;
        console.log(VIN1+ " = VIN");
        var countEngine=0;
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            
                            
                            
                            var queryClause2 = "Select x.count as countEngine , EngineVIN as VIN, EngineSerialNumber as esn, EngineMake as em, EngineModel as emodel,  EngineYear as ey From Engine , (select count(*) as count FROM Engine Where EngineVIN =" + connection.escape(VIN1) +") as x where Engine.EngineVIN =" + connection.escape(VIN1) +" Order by VIN ";
                            //console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].countEngine!=undefined){
                                             countEngine = rows[0].countEngine;
                                             SerialNumber = new Array(countEngine);
                                             
                                             for(var i =0; i <countEngine ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].VIN!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(5);
                                             
                                             SerialNumber[i]=rows[i].esn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                             // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].VIN;
                                             
                                             dataForShowing1[i][1]=rows[i].esn;
                                             dataForShowing1[i][2]=rows[i].em;
                                             dataForShowing1[i][3]=rows[i].emodel;
                                             dataForShowing1[i][4]=rows[i].ey;
                                             
                                             
                                             
                                             }
                                             
                                             else{console.log("no Vehicle records");
                                             
                                             
                                             }
                                             
                                             }
                                             // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingEngineBasedOnVehicle', {h1:'Select Engine',use:{username:'Administrator'},title:'The result of all Engine Base On specific VIN',EngineCount:countEngine,VIN:VIN1,SerialNumber:SerialNumber,ContactID: ContactID, CompanyID:CompanyID,dataForShowingE:dataForShowing1,selectedSerialNumber:selectedSerialNumber});
                                             }
                                             else{
                                             //Jump tp add new ENgine because there is no Engine records here.
                                             res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
                                             }
                                             }
                                             
                                             else{
                                             console.log('error in Select Engine Info!');
                                             
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;
                                             }
                                             
                                             
                                             
                                             
                                             
                                             
                                             
                                             });
                            });
    }
    else{
        //go direct to page that need you to input a new Engine.
        res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
        
    }

   }
