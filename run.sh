#!/bin/bash

SCRIPT_DIR=$(dirname ${BASH_SOURCE[0]})

port=$(shuf -i 49152-65535 -n 1)

termux-open-url http://localhost:$port
php -S localhost:$port
