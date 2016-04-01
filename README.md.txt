Two MEANJS instances to run on a machine:


siso
create crud module and split them between service (server  -- test/server) and web (client -- test/client)
--> sisoservice 
     
   --config\lib\express.js
        
                /**
 * Configure CORS   add support for cross origin resource sharing
 */
module.exports.initCORS = function (app) {
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);
  
  // Initialize Cross Origin Resource Sharing
  this.initCORS(app);
--> sisoweb
    -- gruntfile.js
      comment out the line 81 as below:
      //   nodeArgs: ['--debug'],
    -- node_modules\grunt-contrib-watch\tasks\lib\livereload.js change the following line:
        var defaults = { port: 35729 }; 
         to
       var defaults = { port: 35730 };
   -- 
