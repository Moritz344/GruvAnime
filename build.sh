#!/bin/bash
ng build --configuration production --base-href ./
npx electron-builder --linux AppImage
