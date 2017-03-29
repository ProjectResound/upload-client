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

## Docker Deployment

### The simplest way to get a demo of this product with the default settings:

1. Download [docker-compose.yml](prod/docker-compose.yml)
2. Determine what URL your API is at. For newer versions of Docker for Mac, this will just be localhost. For containers
hosted on docker-machine, the ip would be what `docker-machine ip` prints out. For this example, I just used the ip of my 
docker-machine (192.168.99.100).
3. Run the following commands in the same directory as `docker-compose.yml`
    * `SECRET_KEY_BASE=pantsareok RAILS_ENV=production docker-compose run api rake db:create`
    * `SECRET_KEY_BASE=pantsareok RAILS_ENV=production docker-compose run api rake db:migrate`
    * `SECRET_KEY_BASE=pantsareok RAILS_ENV=production docker-compose up`
4. The last command above will launch a container for the api, a container for the default postgres database (as well
as the required migrations), a container for background workers, a container for Redis, and the Resound: Store + Manage
container, which is what is visible when visiting your docker host in the browser.
5. To look at what's going on in the background workers queue, resque-web is by default accessible from:
    `http://[API_URL or localhost]:3000/resque`
