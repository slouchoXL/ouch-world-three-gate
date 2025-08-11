#!/usr/bin/env bash
set -e
mkdir -p libs/jsm/loaders libs/jsm/controls libs/draco
curl -L -o libs/three.module.js https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js
curl -L -o libs/jsm/loaders/GLTFLoader.js https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js
curl -L -o libs/jsm/controls/OrbitControls.js https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js
echo "Done downloading libs."
