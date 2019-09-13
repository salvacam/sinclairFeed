#!/usr/bin/env bash
convert icon.png -resize 512x512\> icon-512x512.png 
convert icon-512x512.png -resize 192x192\> icon-192x192.png 
convert icon-512x512.png -resize 144x144\> icon-144x144.png 
convert icon-512x512.png -resize 128x128\> icon-128x128.png 
convert icon-512x512.png -resize 96x96\> icon-96x96.png 
convert icon-512x512.png -resize 48x48\> icon-48x48.png 
convert icon-512x512.png -resize 24x24\> icon.png 
