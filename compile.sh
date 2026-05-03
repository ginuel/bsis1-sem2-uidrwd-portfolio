#!/bin/bash

SCRIPT_DIR=$(dirname ${BASH_SOURCE[0]})


{
	cd "$SCRIPT_DIR"
	rg -nH -g '!*.{txt,sh}' "."

	cd images
	rg -nH -g '!*.{png,jpg}' "."
} > src.txt
