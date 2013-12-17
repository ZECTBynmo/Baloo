// Set us up to use JSON5
require('json5/lib/require');

// leto-marker-router-requires
var config = require("../config");


//////////////////////////////////////////////////////////////////////////
// Constructor
function Router() {

}


// GET /adminpanel
exports.adminpanel = function( req, res ) {

    // We don't want the browser to cache the results 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.json( 200, {} );
};


// POST /upload
Router.prototype.upload = function( req, res ) {
    
    var file = req.body,
    	uploadID = uuid.v1(),
    	fileExtension = file.name.split('.').pop(),
        fileBuffer;

    var outputPath = config.upload_dir + '/' + uploadID + "." + fileExtension;

    // If the upload folder doesn't exist already, create it
    if( !fs.existsSync(config.upload_dir) ) {
        fs.mkdirSync( config.upload_dir );
    }
    
    // Load the file contents and write it to disk in our uploads folder
    file.contents = file.contents.split(',').pop();
    fileBuffer = new Buffer( file.contents, "base64" );
    fs.writeFileSync( outputPath, fileBuffer );

    var successData = {
    	guid: uploadID
    };

    res.json( 200, successData );
}