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
/*
if(!req.isAuthenticated()) {
        res.redirect('/login');
       
    } else {*/
    var dataForShowing1=new Array();
    var selectedCompanyID= req.query.selectedCompanyID;
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countCompanyID=0;
                            var CompanyID;
                            var CompanyName;
                            var queryClause2 = "Select x.countt as countCompanyID,CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company,(select count(*) as countt FROM Company) as x Order by CompanyName ";
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             countCompanyID = rows[0].countCompanyID;
                                             CompanyID = new Array(countCompanyID);
                                             CompanyName = new Array(countCompanyID);
                                             for(var i =0; i <countCompanyID ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].ci!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(12);
                                             CompanyID[i]=rows[i].ci;
                                             CompanyName[i]=rows[i].cn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].ci;
                                             
                                             dataForShowing1[i][1]=rows[i].cn;
                                             dataForShowing1[i][2]=rows[i].ba;
                                             dataForShowing1[i][3]=rows[i].bc;
                                             dataForShowing1[i][4]=rows[i].bs;
                                             dataForShowing1[i][5]=rows[i].bz;
                                             dataForShowing1[i][6]=rows[i].bcfn;
                                             dataForShowing1[i][7]=rows[i].bcln;
                                             dataForShowing1[i][8]=rows[i].bce;
                                             dataForShowing1[i][9] = rows[i].bcp;
                                             dataForShowing1[i][10] = rows[i].csid;
                                             
                                             }
                                             
                                             else{console.log("no company records");
                                             
                                             
                                             }
                                             
                                             }
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingCompanyadmin', {h1:'Select Company',use:{username:'Administrator'},title:'The result of all Companys',CompanyCount:countCompanyID,CompanyID:CompanyID,CompanyName:CompanyName,dataForShowingE:dataForShowing1,selectedCompanyID:selectedCompanyID});
                                             }
                                             else{
                                             console.log('error in Select CompanyInfo!');
                                             
                                             res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select CompanyInfo!'});
                                             return;
                                             }

                                             
                                             

                            
                            
                                             });
                            })
    //}
   
}

