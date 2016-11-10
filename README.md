# upload-client

The client-facing part of the "uploading large files" proof of concept.  This app was generated by FountainJS and makes use of gulp for development, and testing. For production, see [Docker](#docker) instructions. 

The javascript takes a large file, encodes it into a FLAC file, cuts it into chunks, and uploads it using the HTML5.

Integrity of the file is done by checking the file size in bytes.  While this is not as accurate as doing a checksum, it's simpler than having the client do the md5 checksum on the file.  When the uploaded file's size does not match the source file size, an error message is shown users are encouraged to try again.


## Requirements

* npm
* gulp


## Development

`gulp serve`

## Docker

For production, pull down the docker image of just the distribution version of the app and run the following command, which will start nginx and serve all the files needed for the app.

`docker run --name="loudly-upload" -d -v /nginx-logs:/var/log/nginx -p 8080:80 521425532736.dkr.ecr.us-west-2.amazonaws.com/loudly`