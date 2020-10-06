#!/bin/bash

set -e 

mongo <<EOF
use admin
db = db.getSiblingDB('couponat')
db.createUser({
  user: '$COUPONAT_DB_USER',
  pwd: '$COUPONAT_DB_PASS',
  roles: [
    {
      role: "readWrite",
      db: "couponat"
    }
  ]
});

EOF