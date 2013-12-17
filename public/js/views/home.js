window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();

        $(".download-button", this.el).click( function() {
			upload();
		});
    },

    render:function () {
    	var _this = this;

    	$(this.el).html(this.template());

        var all_files = [],
		    current_file_id = 0,
		    locked = false,
		    prev_count_files = 0,
		    waiting = 0,
		    drop, 
		    dropzone, 
		    handleNextFile, 
		    handleReaderLoad, 
		    noopHandler;

		var noopHandler = function(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		};

		var drop = function(evt) {

			noopHandler( evt );

			var files = evt.dataTransfer.files,
			    count = files.length,
			    i, j;

			if( count > 0 ) {
				prev_count_files = all_files.length;

				// Remove previous file items which we'll reinsert later
				if ( $("#dropzoneLabel", this.el).length !== 0 ) {
					$("#dropzone", this.el).html('');
				}

				// Insert a new item for each file that's been dropped since the beginning of time
				for( i = prev_count_files + waiting, j = 0; i < prev_count_files + files.length + waiting; i++, j++ ) {
					$("#dropzone", this.el).append('<div class="file ' + i + '"><div class="name">' + files[j].name + '</div><div class="audio"></div><div class="progress">Waiting...</div></div>');
				}

				waiting += count;

				if( !locked ) {
					waiting -= count;
					all_files.push.apply( all_files, files );

					model.addFiles( all_files, function() {
					}, function(file) {
						var li = document.createElement("li");
						zipProgress.value = 0;
						zipProgress.max = 0;
						li.textContent = file.name;
						li.appendChild(zipProgress);
//						fileList.appendChild(li);
					}, function( current, total, iFile ) {
						zipProgress.value = current;
						zipProgress.max = total;

						var percentComplete = 100 * current / total;

						$(".file." + iFile + " .progress").text( "Zipping: " + percentComplete.toFixed(0) + " %" );

						console.log( "File: " + iFile + " : " + percentComplete.toFixed(2) );
					}, function() {
						if (zipProgress.parentNode)
							zipProgress.parentNode.removeChild(zipProgress);

						console.log( "Finished zipping files" );
//						fileInput.value = "";
//						fileInput.disabled = false;
					});
//					handleNextFile();
				}
			}
		};

		var handleReaderLoad = function(evt) {
			var current_file = {};

			current_file.name = all_files[current_file_id].name;
			current_file.type = all_files[current_file_id].type;
			current_file.contents = evt.target.result;
			current_file.dsp = _this.model.id;

			$.post('/upload', current_file, function(data, textStatus, jqXHR) {

				if( jqXHR.status == 200 ) {
					var guid = JSON.parse( jqXHR.responseText ).guid,
						oldName = $(".file." + current_file_id + " .name", this.el).text();

					// Update the file bar 
					$(".file." + current_file_id + " .progress", 	this.el).html("Processed");

					document.location.href = "#" + document.location.hash.slice(1) + "/" + guid;				
				} else {
					$(".file." + current_file_id + " .progress", this.el).html("Failed");
				}

				all_files[current_file_id] = 1;
				current_file_id++;
				handleNextFile();
			});
		};

		var handleNextFile = function() {

			if( current_file_id < all_files.length ) {

				locked = true;

				$(".file." + current_file_id + " .progress", this.el).html("Uploading...");

				var current_file = all_files[current_file_id],
				    reader = new FileReader();

				reader.onload = handleReaderLoad;
				reader.readAsDataURL( current_file );

			} else {
				locked = false;
			}
		};

		dropzone = $("#dropzone", this.el).get(0);

		dropzone.addEventListener( "dragenter", noopHandler, false );
		dropzone.addEventListener( "dragexit", noopHandler, false );
		dropzone.addEventListener( "dragover", noopHandler, false );
		dropzone.addEventListener( "drop", drop, false );

        return this;
    }

});

function upload() {
	var name = $("#name-input").val();

	model.getBlobURL( function(blobURL, blob) {
		var data = {
			name: name,
			file: blob
		};

		$.post( "/upload", {
			url: "/upload",
			data: {
				file: blobURL,
				name: name,
			},
				success: function(response) {
				alert('ok');
			}
		});
	});	
}