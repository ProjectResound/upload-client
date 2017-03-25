# Resound: Store

The client-facing part of audio uploading.  The app makes use of gulp for development and testing.
For production, see [Docker](#docker) instructions. 

The javascript takes a large audio file and uploads it in chunks to the server.  The uploading process can be paused
and resumed.

## Requirements

Development requirements:

* npm
* gulp

Production requirements:

* docker


## Development

1. In src/index.html, change the api-url attribute to point to where your api url is:
    ```
    <resound-root api-url="http://<INSERT_API_URL_HERE>/upload">
    </resound-root>
    ```

2. Run `gulp serve` and visit localhost.

## Docker

### To run all containers with default deployment settings:

1. Download [docker-compose.yml](prod/docker-compose.yml)
2. Determine what URL your API is at. For this example, I just used the ip of my docker-machine (192.168.99.100).
3. Run the following commands in the same directory as `docker-compose.yml`
    * `SECRET_KEY_BASE=yourtopsecret RAILS_ENV=production API_URL=192.168.99.100:3000 docker-compose up`
    * `SECRET_KEY_BASE=yourtopsecret RAILS_ENV=production API_URL=192.168.99.100:3000 docker-compose run api rake db:create` 
    * `SECRET_KEY_BASE=yourtopsecret RAILS_ENV=production API_URL=192.168.99.100:3000 docker-compose run api rake db:migrate`
    * `SECRET_KEY_BASE=yourtopsecret RAILS_ENV=production API_URL=192.168.99.100:3000 docker-compose up`

### To run each container manually:

For production, pull down the docker image of just the distribution version of the app and run the following command, 
which will start nginx and serve all the files needed for the app.  Make sure to supply the API_URL when running the
`docker run` command.  It should point to your API URL, not including the `/upload` path.

`docker run -d -p 8080:80 -e API_URL=<FILL IN API URL HERE> docker.io/scprdev/resound-store-manage`

To see this in action in your browser, get your docker machine's ip:

`docker-machine ip`

And visit the url in your browser: http://[DOCKER-MACHINE-IP]:8080

You'll be able to see the Resound Store + Manage client if your container was run correctly.