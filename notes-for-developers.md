# How to load the extension in development mode

## For Chrome / Chromium / Edge / Kiwi / Opera

- Load the unpacked extension via ```manifest.json``` from the ```extension/``` folder

## For Firefox

- Temporarily, copy ```extension/manifest-firefox.json``` to ```extension/manifest.json```
- Load the unpacked extension via ```manifest.json``` from the ```extension/``` folder
- Once you are done, before committing any changes, revert ```extension/manifest.json``` to its original state


## For Android Firefox

- Connect the Android device to desktop via USB
- Enable USB debugger in the Android device and Android Firefox
- Go to ```about:debugging``` in the desktop Firefox
- ```$ npm install --global web-ext```
- ```$ web-ext run --target=firefox-android``` # This would list the available devices
- ```$ web-ext run --target=firefox-android --android-device=<device-id>```  
  For example: ```$ web-ext run --target=firefox-android --android-device=A1B2C3D4E5F```
