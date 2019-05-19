#!/bin/bash

set -eo pipefail
shopt -s nullglob
OVERPASS_COMPRESSION=${OVERPASS_COMPRESSION:-gz}

if [ ! -d /db/db ] ; then
  lftp -c "get -c \"$OVERPASS_PLANET_URL\" -o /db/planet; exit" \
  && /app/bin/init_osm3s.sh /db/planet /db/db /app "--compression-method=$OVERPASS_COMPRESSION" \
  && rm /db/planet \
  && cp -r /app/etc/rules /db/db \
  && chown -R overpass:overpass /db \
  && echo "Overpass ready, you can start your container with docker start"
  exit
fi

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
