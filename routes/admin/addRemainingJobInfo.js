var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Add Remaining Job Info';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });
var VIN="";
var Date1="";
var PO="";
var WO="";
var ContactID_Specific="";
var VehicleTotalMileage=0;
var VehicleTotalHours=0 ;

var JobLocation="";
var TypeOfDPF = "";
var reason="";
var JobID ="";
var DPFID;
var ContactID;
var OldJobID="";

var backURL = "";
var datetime = new Date();
var month ="";

if (datetime.getMonth()<9)
{
    month = "0"+(datetime.getMonth()+1).toString();
    
}else {month =(datetime.getMonth()+1).toString();}

var today = datetime.getFullYear()+"-"+month+"-"+datetime.getDate();
//console.log(today);

//==============================================================================================
exports.show=function(req,res){
var user = req.user;
/*
    if(!req.isAuthenticated()) {
        res.redirect('/login');
        console.log('not authed in userPage');
    }
    else{*/

    backURL=backURL;
    var CompanyID=req.query.CompanyID;

    var ErrorCode = 0;
    if(req.query.ErrorCode!=undefined){
        ErrorCode = req.query.ErrorCode;
    }
    if(ErrorCode == 0){
        //console.log('1111111');
         reason = req.body.ReasonForCleaning;
    
         ContactID= req.query.ContactID;
         VIN =req.query.VIN;
    //console.log(VIN);
    
    var DPFID = req.query.DPFID;
    //console.log(req.body.ReasonForCleaning);
    res.render('addRemainingJobInfo', {ContactID: ContactID,CompanyID:CompanyID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title});
    }
    else{
   
        
         ContactID= req.query.ContactID;
         VIN =req.query.VIN;
        //console.log(VIN);
        
         DPFID = req.query.DPFID;
        //console.log(req.body.ReasonForCleaning);
        res.render('addRemainingJobInfo', {ContactID: ContactID,CompanyID:CompanyID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:'Error in select Job ID'});

    }
//}
}

exports.handle_Input1=function (req,res,backURL)
{
/*
var user = req.user;

    if(!req.isAuthenticated()) {
        req.redirect('/login');
        console.log('not authed in userPage');
    }
    else{*/
     // backURL=backURL;
    
    //console.log('1111111');
    
     var CompanyID=req.query.CompanyID;
      ContactID= req.query.ContactID;
      VIN =req.query.VIN;
    //console.log(VIN);
    
       DPFID = req.query.DPFID;
    //console.log(req.body.ReasonForCleaning);
    res.render('addRemainingJobInfo', {ContactID: ContactID,CompanyID:CompanyID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title});
   // }
}
exports.handle_Input2=function (req,res)
{
	var CompanyID=req.query.CompanyID;
/*
   var user = req.user;

    if(!req.isAuthenticated()) {
        res.redirect('/login');
        console.log('not authed in userPage');
    }
    else{*/
    //console.log('1111111');
       var reason_temp= req.body.ReasonForCleaning;
       //console.log("reason :" +reason_temp);
    if(reason_temp=="" ||reason_temp ==undefined){
        reason="";
    }
    else{
       
        if(!Array.isArray(reason_temp)){
            reason=reason_temp;
        }
        else{
        for(var i =0;i<5;i++){
            if(reason_temp[i]==undefined){
                break;
            }
            else{
                if(i>0){
                    reason+=" & ";
                }
                //console.log(reason_temp[i]);
                reason+=reason_temp[i];
                
            }
                
        }
        }
    }
    //console.log("reason"+reason);
    //console.log("backURL"+backURL);
       ContactID= req.query.ContactID;
       VIN =req.query.VIN;
    //console.log(VIN);
    
        DPFID = req.query.DPFID;
        //console.log(req.body.ReasonForCleaning);
        Date1 = req.body.date;
        PO=req.body.PurchaseOrderNumber;
        WO =req.body.WorkOrderNumber;
        ContactID_Specific = req.query.ContactID;
        VehicleTotalMileage = req.body.VehicleTotalMileage;
        VehicleTotalHours = req.body.VehicleTotalHours;
        console.log("OldJobID"+req.body.OldJobID);
console.log('date111 ' +Date1);
        if(req.body.OldJobID!="" && req.body.OldJobID!=undefined){
            OldJobID=req.body.OldJobID;
        }
        if(VehicleTotalHours==""||VehicleTotalHours==''|| VehicleTotalHours==null)
        {
            VehicleTotalHours=0;
        }
        JobLocation = req.body.CleaningLocation;
        JobLocation = JobLocation.substring(0,2);
        TypeOfDriving= req.body.TypeOfDriving;
    
        var res1 = Date1.split("/");
    
        var year = res1[2];
        var month= res1[0];
        var day = res1[1];
        
        JobID = JobLocation+ year.substr(year.length - 2)+month+day;
        //console.log(JobID);
        var queryClause="SELECT JobID FROM Job WHERE JobID Like '"+JobID+"%' ORDER BY JobID DESC LIMIT 1 ;"
        //JobID consists of FirstTwo letter of Location, year(two digis)+month (2 digits)+ Day (2 digits)+SequenceNumber;
        //Search for the Sequence number
        //console.log(queryClause);
        
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            
                            response.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            
                            connection.query(queryClause,function(err,rows){
                                             
                                             if(!err)
                                             {
                                             if ( rows[0]!=null )
                                             {
                                             var JobID_Last = rows[0].JobID;
                                             var JobID_SN = JobID_Last.substr(JobID_Last.length - 2);
                                             var JobID_SN_INT =parseInt(JobID_SN)+1 ;
                                             if(JobID_SN_INT<10)
                                             JobID=JobID +"0"+JobID_SN_INT.toString();
                                             else JobID = JobID +JobID_SN_INT.toString();
                                             
                                             var checkJob= "Select Count(1) as countNum , JobID as jbid FROM Job WHERE VIN = "+connection.escape(VIN) +" And ContactID = " +connection.escape(ContactID_Specific)+" And DPFID= "+connection.escape(DPFID)+" And StartTime = "+ connection.escape(Date1)+"And ReasonForCleaning =" +connection.escape(reason)+";";
                                             connection.query (checkJob,function (err,rows){
                                                               if(!err)
                                                               {
                                                               if (rows[0].countNum==1)
                                                               {
                                                               JobID = rows[0].jbid;
                                                               // we found this contact has already get this Job, Just
                                                               res.render('addRemainingJobInfo', {CompanyID:CompanyID,ContactID: ContactID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:"You have already required a job for this vehicle on this day, if you want to add anyway, select Always insert."});

                                                               console.log('Found this Job');
                                                               connection.release();
                                                               
                                                               }
                                                               else if (rows[0].countNum==0)
                                                               {
                                                               var JobInput={JobID:JobID, ContactID:ContactID_Specific, StartTime:Date1,WorkOrderNumber:WO,PurchaseOrderNumber:PO,VIN:VIN, VehicleTotalMileage:VehicleTotalMileage,VehicleTotalHours:VehicleTotalHours,JobLocation:'Fogelsville',ReasonForCleaning:reason,TypeOfDriving:TypeOfDriving,DPFID:DPFID,OldJobID:OldJobID};
                                                               console.log(JobInput);
                                                               var queryClause2="Insert Into Job Set ?";
                                                               connection.query(queryClause2,JobInput, function (err,rows){
                                                                                connection.release();
                                                                                if(!err){
                                                                               // res.render('addRemainingJobInfo', {ContactID: ContactID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:"Successfully Insert the Job"});
								res.redirect('/jobConclusion?JobID='+JobID+'&ContactID='+ContactID+'&VIN='+VIN+'&DPFID='+DPFID+'&message=1'+'&CompanyID='+CompanyID);
                                                                                }
                                                                                else{
                                                                                  res.render('addRemainingJobInfo', {CompanyID:CompanyID,ContactID: ContactID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:err.code});
                                                                                }
                                                                                });

                                                               }
                                                               }
                                                               else
                                                               {
                                                               console.log('error in selecting Job');
                                                               response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page',errorMessage:err.code})
                                                               
                                                               }
                                                               
                                                               });
                                             
                                             //--------------------------------------------------------------------------------------------------------------------------------------------------
                                             //--------------------------------------------------------------------------------------------------------------------------------------------------
                                             //--------------------------------------------------------------------------------------------------------------------------------------------------
                                             //--------------------------------------------------------------------------------------------------------------------------------------------------
                                             //--------------------------------------------------------------------------------------------------------------------------------------------------
                                             }
                                             else
                                             {
                                             console.log("No Result For this database for this day, so we new a record" );
                                             JobID =JobID+"01";
                                             console.log(JobID);
                                             
                                             var JobInput={JobID:JobID, ContactID:ContactID_Specific, StartTime:Date1,WorkOrderNumber:WO,PurchaseOrderNumber:PO,VIN:VIN, VehicleTotalMileage:VehicleTotalMileage,VehicleTotalHours:VehicleTotalHours,JobLocation:'Fogelsville',ReasonForCleaning:reason,TypeOfDriving:TypeOfDriving,DPFID:DPFID,OldJobID:OldJobID};
                                             var queryClause2="Insert Into Job Set ?";
                                             connection.query(queryClause2,JobInput, function (err,rows){
                                                              connection.release();
                                                              if(!err){
                                                              //res.render('addRemainingJobInfo', {ContactID: ContactID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:"Successfully Insert the Job"});
res.redirect('/jobConclusion?JobID='+JobID+'&ContactID='+ContactID+'&VIN='+VIN+'&DPFID='+DPFID+'&message=1'+'&CompanyID='+CompanyID);
                                                              }
                                                              else{
                                                              res.render('addRemainingJobInfo', {CompanyID:CompanyID,ContactID: ContactID,VIN:VIN,title:"Add Remaining JobInfo",DPFID:DPFID,title:title,h1:title,errorMessage:err.code});
                                                              }
                                                              });
                                             
                                             
                                             
                                             
                                             return;
                                             
                                             }
                                             }
                                             else{//error in select JOBID
                                             console.log("error in select JobID");
                                             res.redirect(backURL+"?ErrorCode=1")
                                             
                                             }
        
        
                                             });
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            });
   // }
    
}

