#!/bin/bash

filename=/usr/share/nginx/html/index.html
pattern=XXX_RESOUND_API_URL_XXX

sed -i "s/${pattern}/${API_URL}/g" ${filename}
nginx -g 'daemon off;'