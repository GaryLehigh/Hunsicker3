var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Job';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (req,res)
{
var queryClause2="";
/*
if(!req.isAuthenticated()) {
        res.redirect('/login');
       
    } else {
*/
    var dataForShowing1=new Array();//Company
    var dataForShowing2=new Array();//Contact
    var dataForShowing3=new Array();//DPF
    var dataForShowing4=new Array();//Vehicle
    var dataForShowing5=new Array();//Engine
    var dataForShowing6=new Array();//Job

    var CompanyID=req.query.CompanyID;
    console.log('wwwwwwwwwwwwwww   '+ CompanyID);
    var VIN = req.query.VIN;
    var ContactID = req.query.ContactID;
    var DPFID = req.query.DPFID;
    var JobID = req.query.JobID;
    console.log(JobID);
      poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            
                            
                           
                             queryClause2 = "Select CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company WHERE CompanyID= "+connection.escape(CompanyID);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             
                                             if(!err)
                                             {
                                            
                                    
                                             
                                             if (rows[0]!=null && rows[0].cn!= undefined)
                                             {
                                             
                                             
                                            
                                         console.log('111111111111111111111');
                                    
                                             dataForShowing1[0]=rows[0].cn;    
                                             dataForShowing1[1]=rows[0].ci;
                                             dataForShowing1[2]=rows[0].ba;
                                             dataForShowing1[3]=rows[0].bc;
                                             dataForShowing1[4]=rows[0].bs;
                                             dataForShowing1[5]=rows[0].bz;
                                             dataForShowing1[6]=rows[0].bcfn;
                                             dataForShowing1[7]=rows[0].bcln;
                                             dataForShowing1[8]=rows[0].bce;
                                             dataForShowing1[9] = rows[0].bcp;
                                             dataForShowing1[10] = rows[0].csid;
                                             
                                             }
                                             
                                             else{console.log("no company records");}
                                             
                                             
                                             
                                             
//------------------------------------------------------Contact----------------------------------------------------------------------------------------------------
  queryClause2 = "Select ContactID as ci, FirstName as fn, LastName as ln, PhoneNumber as pn, EmailAddress as ea, SiteAddress as sa, SiteCity as sc, SiteState as ss,SiteZip as sz, ContactStatusID as csid From Contact WHERE ContactID = "+connection.escape(ContactID);
                       //  console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         
                                         if(!err)
                                         {
                                         if(rows[0]!=null && rows[0].ci !=undefined){
                                         
                                         
                                        console.log('22222222222222222222222222');
   
                                         
                                         dataForShowing2=new Array(12);

                                         dataForShowing2[0]=rows[0].ci;
                                         
                                         dataForShowing2[1]=rows[0].fn;
                                         dataForShowing2[2]=rows[0].ln;
                                         dataForShowing2[3]=rows[0].pn;
                                         dataForShowing2[4]=rows[0].ea;
                                         dataForShowing2[5]=rows[0].sa;
                                         dataForShowing2[6]=rows[0].ss;
                                         
                                         dataForShowing2[7]=rows[0].sc;
                                         dataForShowing2[8]=rows[0].sz;
                                         dataForShowing2[9]=rows[0].csid;
                                        
                                   
                                         
                                         }
                                         
                                         
                                         else{
                                         console.log("no contact records");
                                         //Here go direct to add new Contact for this company pape.
                                        
                                         res.render('addNewContactAdmin',{title:'Add New Contact Admin',CompanyName: dataForShowing2[11],CompanyID:CompanyID});
                                         
                                         }
//***********************************************************************************************************************************************DPF 
					




                       
                         queryClause2 = "Select DPFID as dpfid, PartNumber as pn, SerialNumber as sn, OtherNumber as onum, Manufacturer as mf, OuterDiameter as od,SubstrateDiameter as sd, OuterLength as ol, SubstrateLength as sl, DPForDOC as dorc, TypeOfSubstrate as ts , TimesCleaned as tc, CompanyID as ci From DPFDOC WHERE DPFID= " +connection.escape(DPFID);
                        //console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].dpfid!=undefined){
                                         
                                         dataForShowing3=new Array(13);
                                       
                                         dataForShowing3[0]=rows[0].dpfid;
                                         
                                         dataForShowing3[1]=rows[0].pn;
                                         dataForShowing3[2]=rows[0].sn;
                                         dataForShowing3[3]=rows[0].onum;
                                         dataForShowing3[4]=rows[0].mf;
                                         dataForShowing3[5]=rows[0].od;
                                         dataForShowing3[6]=rows[0].sd;
                                         dataForShowing3[7]=rows[0].ol;
                                         dataForShowing3[8]=rows[0].sl;
                                         dataForShowing3[9]=rows[0].dorc;
                                         dataForShowing3[10]=rows[0].ts;
                                         dataForShowing3[11]=rows[0].tc;
                                         dataForShowing3[12]=rows[0].ci;
                                         console.log('33333333333333333333333');
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Vehicle


                        
                       
                        var VehicleID;
                         queryClause2 = "Select  VIN as VIN, VehicleID as vid, UnitNumber as un, VehicleMake as vmake, VehicleModel as vmodel, VehicleYear as vy, CompanyID as ci FROM Vehicle where VIN="+connection.escape(VIN);
                        
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                        
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].vid!=undefined){
                                         
                                         dataForShowing4=new Array(7);
                                      
                                         //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                         // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                         //console.log("");
                                         dataForShowing4[0]=rows[0].VIN;
                                         
                                         dataForShowing4[1]=rows[0].vid;
                                         dataForShowing4[2]=rows[0].un;
                                         dataForShowing4[3]=rows[0].vmake;
                                         dataForShowing4[4]=rows[0].vmodel;
                                         dataForShowing4[5]=rows[0].vy;
                                         dataForShowing4[6] =rows[0].ci;
                                         //console.log(dataForShowing1);
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Engine

  console.log('4444444444444444444444444444');

                          
                            
                            
                            queryClause2 = "Select  EngineVIN as VIN, EngineSerialNumber as esn, EngineMake as em, EngineModel as emodel,  EngineYear as ey From Engine Where EngineVIN =  "+connection.escape(VIN);
                            //console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].esn!=undefined){


                                             
                                             dataForShowing5=new Array(5);
                                             
                                           
                                             dataForShowing5[0]=rows[0].VIN;
                                             
                                             dataForShowing5[1]=rows[0].esn;
                                             dataForShowing5[2]=rows[0].em;
                                             dataForShowing5[3]=rows[0].emodel;
                                             dataForShowing5[4]=rows[0].ey;
  console.log('55555555555555555555555');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++job

				queryClause2 ="select * From Job where JobID="+connection.escape(JobID);
				connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].JobID!=undefined){


                                             
                                             dataForShowing6=new Array(14);
                                             
                                           
                                             dataForShowing6[0]=rows[0].JobID;
                                             
                                             dataForShowing6[1]=rows[0].ContactID;
                                             dataForShowing6[2]=rows[0].WorkOrderNumber;
                                             dataForShowing6[3]=rows[0].PurchaseOrderNumber;
                                             dataForShowing6[4]=rows[0].StartTime;
                                             dataForShowing6[5]=rows[0].EndTime;
                                             dataForShowing6[6]=rows[0].VIN;
                                             dataForShowing6[7]=rows[0].VehicleTotalMileage;
                                             dataForShowing6[8]=rows[0].VehicleTotalHours;
                                             dataForShowing6[9]=rows[0].DPFID;
                                             dataForShowing6[10]=rows[0].ReasonForCleaning;
                                             dataForShowing6[11]=rows[0].TypeOfDriving;
                                             dataForShowing6[12]=rows[0].OldJobID;
                                             dataForShowing6[13]=rows[0].JobLocation;
  console.log('6666666666666666666');
  						var message="";
if(req.query.message==1){
message="Job has been added successfully!";
}
else if(req.query.message==0){
message="Failed to add this job!";
}
else
{
message=req.query.message;
}
                                         res.render('jobConclusion', {h1:'Job Conclusion',title:'Job Conclusion',VIN:VIN,CompanyID:CompanyID,ContactID:ContactID,DPFID:DPFID,JobID:JobID,message:message, dataForShowingE1:dataForShowing1,dataForShowingE2:dataForShowing2,dataForShowingE3:dataForShowing3,dataForShowingE4:dataForShowing4,dataForShowingE5:dataForShowing5,dataForShowingE6:dataForShowing6});
					}
						else{
					//jump to add job page

}
}else{
   console.log('error in Select Job Info!');
                                      
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;

}
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++End job
                           
                                           
                                             }
                                             else{
                                             //jump to add new engine.
                                             console.log("Need to insert this engine.")
                                             }

                                            }
                                             
                                             else{
                                             console.log('error in Select Engine Info!');
                                            
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;
                                             }
                                             
  
                                             
                                             });
                         

                                         
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Engine

                                         }
                                         
                                         
                                         else{console.log("no Vehicle records");
                                         //Jump to add vehicle page;
                                       
                                         res.redirect('/addNewVehicleAdmin/'+CompanyID+'?ContactID='+ContactID+'&ContactName=' +ContactName);
                                         
                                         }
                                         
                                         }
                                    
                                         
                                         
                                         else{
                                         console.log('error in Select Vehicle Info!');
                                    
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Vehicle Infomation',title:"Error in Select VehicleInfo",errorMessage :'Error in Select Vehicle Info!'});
                                         return;
                                         }
       
                                         
                                         });
                       


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Vehicle
                                         

                                         
                                         }
                                         
                                         else{console.log("no DPFDOC records");
                                         //jump to add new DPF page.
                                         res.redirect('/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);
                                         app.set('views', path.join(dirpath, 'views'));
                                         }
                                         
                                         }
                                       
                                         
                                        
                                         
                                         
                                         else{
                                         console.log('error in Select DPF Info!');
                                        
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select DPF Infomation',title:"Error in Select DPFInfo",errorMessage :'Error in Job Conclusion DPF Info!'});
                                         return;
                                         }

                                         
                                         });
                        



					
//  ***************************************************************************************************************************************************                                       
                                         }
                                  
                                         
                                         else{
                                         console.log('error in Select Contact Info!');
                                        
                                         res.render('errorPage', {usernameE: 'Administrator',h1:'Error in Select Contact Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Job Conclusion Contact Info!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        
                                             
//----------------------------------------------------------------------------------------------------------------------------------------------------------                                             
                                             }
                                             
                                             else{
                                             console.log('error in Select CompanyInfo!');
                                           
                                             res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation in edit',title:"Error in Select ComapnyInfo in edit",errorMessage :'Error in Job Conclusion CompanyInfo!'});
                                             return;
                                             }

                                             
                                             

                            
                            
                                             });
                                });
      
   
//}

}
