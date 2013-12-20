// Set us up to use JSON5
require('json5/lib/require');

// leto-marker-router-requires
var lineReader = require('line-reader'),
    config = require("../config"),
	uuid = require("node-uuid"),
    path = require('path'),
	fs = require("fs");

var recordsFile = "./records.csv",
    records = [];

loadCSV( recordsFile, function(contents) {
    console.log( "Loaded " + contents.length + " records" );
    records = contents;
});

// enum record indices
var INDEX_NAME = 0,
    INDEX_EMAIL = 1,
    INDEX_NOISE = 2,
    INDEX_URL = 3;

// If our records don't exist yet, create them
if( !path.existsSync(recordsFile) ) {
    fs.writeFileSync( recordsFile, "" );
}

//////////////////////////////////////////////////////////////////////////
// Constructor
function Router() {

}


// GET /adminpanel
Router.prototype.adminpanel = function( req, res ) {

    // We don't want the browser to cache the results 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.json( 200, records );
};


// POST /upload
Router.prototype.upload = function( req, res ) {
    var _this = this;
    
    var data = req.body,
        params = JSON.parse(req.body.params),
    	uploadID = uuid.v1(),
    	fileExtension = "zip",
        fileBuffer;

    var outputPath = config.upload_dir + '/' + uploadID + "." + fileExtension;

    // If the upload folder doesn't exist already, create it
    if( !fs.existsSync(config.upload_dir) ) {
        fs.mkdirSync( config.upload_dir );
    }

    var zipFile = req.files["files.zip"];

    fs.readFile( zipFile.path, function( err, data ) {
        fs.writeFile( outputPath, data, function( err ) {
            var successData = {
                guid: uploadID
            };

            params.url = params.origin + "/uploads/" + uploadID + ".zip";

            addRecordItem( params );

            res.json( 200, successData );
        });
    });
}


function addRecordItem( record ) {
    var recordArray = [];

    recordArray[INDEX_NAME] = record.name;
    recordArray[INDEX_EMAIL] = record.email;
    recordArray[INDEX_NOISE] = record.noise;
    recordArray[INDEX_URL] = record.url;

    records.push( recordArray );

    writeCSV( recordsFile, records );
}


function loadCSV( filePath, callback ) {
    contents = [];

    // Load up our CSV file
    lineReader.eachLine( filePath, function(line, last) {
        contents.push( line.split(",") );

        if( last ) {
            callback( contents );
        }
    });
}


function writeCSV( filePath, contents ) {
    var strContents = "";

    for( var iItem in contents ) {
        strContents += contents[iItem].join() + "\n";
    }

    fs.writeFileSync( filePath, strContents );

    console.log( "Updated CSV" );
}


exports.Router = Router;