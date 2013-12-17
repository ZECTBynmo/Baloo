// Set us up to use JSON5
require('json5/lib/require');

// leto-marker-router-requires
var config = require("../config"),
	uuid = require("node-uuid"),
	fs = require("fs");


//////////////////////////////////////////////////////////////////////////
// Constructor
function Router() {

}


// GET /adminpanel
Router.prototype.adminpanel = function( req, res ) {

    // We don't want the browser to cache the results 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.json( 200, {} );
};


// POST /upload
Router.prototype.upload = function( req, res ) {
    
    var data = req.body,
    	uploadID = uuid.v1(),
    	fileExtension = ".zip",
        fileBuffer;

    var outputPath = config.upload_dir + '/' + uploadID + "." + fileExtension;

    // If the upload folder doesn't exist already, create it
    if( !fs.existsSync(config.upload_dir) ) {
        fs.mkdirSync( config.upload_dir );
    }

//    fileBuffer = new Buffer( data.file, "base64" );
    fs.writeFileSync( outputPath, data.file );
    console.log( outputPath );
    console.log( data );

    var successData = {
    	guid: uploadID
    };

    res.json( 200, successData );
}

exports.Router = Router;