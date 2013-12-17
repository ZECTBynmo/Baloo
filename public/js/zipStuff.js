var zipProgress = document.createElement("progress");
var fileList = document.getElementById("file-list");
var filenameInput = document.getElementById("filename-input");

var model = (function() {
	var zipFileEntry, zipWriter, writer, creationMethod, URL = window.webkitURL || window.mozURL || window.URL;

	return {
		setCreationMethod : function(method) {
			creationMethod = method;
		},
		addFiles : function addFiles(files, oninit, onadd, onprogress, onend) {
			var addIndex = $("#dropzone > div").size() - files.length;

			function nextFile() {
				var file = files[addIndex];
				onadd(file);
				zipWriter.add(file.name, new zip.BlobReader(file), function() {
					addIndex++;
					if( addIndex < files.length )
						nextFile();
					else
						onend();
				}, function( current, total ) { 
					onprogress( current, total, addIndex ); 
				});
			}

			function createZipWriter() {
				zip.createWriter(writer, function(writer) {
					zipWriter = writer;
					oninit();
					nextFile();
				}, onerror);
			}

			if (zipWriter)
				nextFile();
			else if (creationMethod == "Blob") {
				writer = new zip.BlobWriter();
				createZipWriter();
			} else {
				createTempFile(function(fileEntry) {
					zipFileEntry = fileEntry;
					writer = new zip.FileWriter(zipFileEntry);
					createZipWriter();
				});
			}
		},
		getBlobURL : function(callback) {
			zipWriter.close(function(blob) {
				var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
				callback(blobURL, blob);
				zipWriter = null;
			});
		},
		getBlob : function( callback ) {
			zipWriter.close( callback );
		}
	};
})();

model.setCreationMethod( "Blob" ); // Lock to blob!

function downloadBlob() {
	model.getBlobURL(function(blobURL) {

//		var clickEvent;
//		clickEvent = document.createEvent("MouseEvent");
//		clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
//		
//		var downloadButton = $(".download-button").get(0);
//
//		downloadButton.href = blobURL;
//		downloadButton.download = "filenameInput.zip";
//		downloadButton.dispatchEvent( clickEvent );  
	});
	event.preventDefault();
	return false;
}