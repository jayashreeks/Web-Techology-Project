var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://mongo:27017/mydata", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		//console.log("Sent data are (POST): Examiner ID :"+req.body.empid+" Examiner Name="+req.body.empname);
		// Submit to the DB
  	var eid = req.body.eid;
    var ename = req.body.ename;
    var equal=req.body.equal;
    var eage=req.body.eage;
    var eins=req.body.eins;
    var epic=req.body.epic;
	db.collection('examiner').insert({eid:eid,ename:ename,equal:equal,eage:eage,eins:eins,epic:epic});
    res.end("Examiner Inserted-->"+JSON.stringify(req.body));
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
  var newExaminer = req.query;
	var eid = req.query['eid'];
  var ename = req.query['ename'];
  var equal = req.query['equal'];
  var eage = req.query['eage'];
  var eins = req.query['eins'];
    db.collection('examiner').insert({eid:eid,ename:ename,equal:equal,eage:eage,eins:eins});	
    //console.log("Sent data are (GET): EXaminerID :"+eid+" and Examiner name :"+ename);
  	res.end("Employee Inserted-->"+JSON.stringify(newExaminer));
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})
//------------------------------------------------------------------
app.post('/update_post', function (req, res) {
  /* Handling the AngularJS post request*/
  console.log(req.body);
res.setHeader('Content-Type', 'text/html');
  req.body.serverMessage = "NodeJS replying to angular"
      /*adding a new field to send it to the angular Client */
//console.log("Sent data are (POST): Employee ID :"+req.body.empid+" Employee Name="+req.body.empname);
  // Submit to the DB
  var eid1=req.body.eid;
  var ename1=req.body.ename;
  db.collection('examiner', function (err, data) {
    data.update({"eid":eid1},{$set:{"ename":ename1}},{multi:true},
      function(err, obj){
        if (err) {
          console.log("Failed to update data.");
      } else {
        if (obj.result.n==1)
        {
        res.end("Examiner Updated-->"+JSON.stringify(req.body));
        console.log("Examiner Updated")
        }
        else
          res.send("Examiner Not Found")
      }
    });
  });  
});
//-------------------------------------------------------------------
app.get("/update", function(req, res) {
  var eid=req.query.eid;
  var ename=req.query.ename;
    //db.collection('employee').update({"empname":empname1},{$set:{"empname":"newemp"}}); 
	//-----------------------------------------
	db.collection('examiner', function (err, data) {
        data.update({"eid":eid},{$set:{"ename": ename}},{multi:true},
            function(err, result){
				if (err) {
					console.log("Failed to update data.");
			} else {
				res.send(result);
				console.log("Examiner Updated")
			}
        });
    });
})	
//--------------SEARCH------------------------------------------
app.get("/search", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var eidnum=req.query.search;
    db.collection('examiner').find({eid: eidnum}).toArray(function(err , i){
        if (err) return console.log(err)
        res.render('search.ejs',{examiners: i})  
     });
  });
  // --------------To find "Single Document"-------------------
	/*var empidnum=parseInt(req.query.empid)
    db.collection('employee').find({'empid':empidnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.post('/delete_1', function (req, res) {
  /* Handling the AngularJS post request*/
  console.log(req.body);
res.setHeader('Content-Type', 'text/html');
  req.body.serverMessage = "NodeJS replying to angular"
      /*adding a new field to send it to the angular Client */
  console.log("Sent data are (POST): Examiner ID :"+req.body.empid+" Examiner Name="+req.body.empname);
  // Submit to the DB
  var eid=req.body.eid;
  db.collection('examiner', function (err, data) {
    data.remove({"eid":eid},function(err, obj){
        if (err) {
          console.log("Failed to remove data.");
      } else {
        if (obj.result.n>=1)
        {
        res.send("Examiner Deleted-->"+JSON.stringify(req.body));
        console.log("Examiner Deleted")
        }
        else
          res.send("Examiner Not Found")
      }
    });
  });
  });

app.get("/delete", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var eidnum=req.query.eid;
	db.collection('examiner', function (err, data) {
        data.remove({"eid":eidnum}, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				res.send(result);
				console.log("Examiner Deleted")
			}
        });
    });
    
  });
app.get('/display', function (req, res) { 
//-----DISPLAY IN JSON FORMAT  -------------------------
/*db.collection('employee').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
	{
		res.status(200).json(docs);
    }
  });*/
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('examiner').find().sort({eid:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{examiners: i})  
     });
//---------------------// sort({empid:-1}) for descending order -----------//
}); 
 
 
var server = app.listen(6500, function () {  
var host = server.address().address  
  var port = server.address().port  
console.log("Server running...")  
})  
}
else
{ 
  db.close();  }
  
});