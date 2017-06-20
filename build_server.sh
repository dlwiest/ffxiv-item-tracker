#!/bin/bash
# Build Pindigo for Server

meteor npm install
meteor build --server-only --architecture=os.linux.x86_64 ../stormblood-aid-build

cd ../stormblood-aid-build
tar -zxf stormblood-aid.tar.gz
cd bundle/programs/server
npm install
