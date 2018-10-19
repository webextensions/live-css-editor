# How to load the extension in development mode

## For Chrome / Chromium / Opera

- Load the unpacked extension via ```manifest.json``` from the ```extension/``` folder

## For Edge / Firefox

- Temporarily, copy ```extension/manifest-edge.json``` or ```extension/manifest-firefox.json``` to ```extension/manifest.json```
- Load the unpacked extension via ```manifest.json``` from the ```extension/``` folder
- Once you are done, before committing any changes, revert ```extension/manifest.json``` to its original state


# Enable extension developer features in Microsoft Edge

Follow the steps mentioned at:
> https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/adding-and-removing-extensions


# Steps to get Microsoft Edge Extension Toolkit

- Go to https://www.microsoft.com/en-us/p/microsoft-edge-extension-toolkit/9nblggh4txvb
- Click on Get / Install button
- It would ask you to "Open Store", go ahead
- Click on Install for the application in "Store"
- If you get an error in installation, you may need to enable updates
    - Run ```services.msc```
    - Ensure that the "Windows Update" service is running
- Launch the application


# Steps to create the ".appx" package for Edge extension

- [Install Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk)

- [Install NodeJS LTS](https://nodejs.org/en/download/)

- ```$ npm install -g manifoldjs```

- ```$ npm run zip-edge-extension``` # This would generate extension-edge.zip

- Extract extension-edge.zip to a new folder

- ```$ manifoldjs -m "<path-to-edge-extension>/manifest.json" -p edgeextension -f edgeextension```

  For example:

  ```$ manifoldjs -m "extension-edge/manifest.json" -p edgeextension -f edgeextension```

- In the file ```<working-directory>/<extension-name>/edgeextension/manifest/appxmanifest.xml```,

  update the following tags:
  ```xml
  <Identity
      Name="INSERT-YOUR-PACKAGE-IDENTITY-NAME-HERE"
      Publisher="CN=INSERT-YOUR-PACKAGE-IDENTITY-PUBLISHER-HERE"
      Version="<Major>.<Minor>.<Build>.<Revision>" /> <!-- UPDATE IDENTITY -->
  ```

  to something like:

  ```xml
  <Identity
          Name="Live-editor-for-CSS-and-LESS-Magic-CSS"
          Publisher="CN=webextensions.org"
          Version="1.2.3.0" /> <!-- UPDATE IDENTITY -->
  ```

  and

  ```xml
  <PublisherDisplayName>INSERT-YOUR-PACKAGE-PROPERTIES-PUBLISHERDISPLAYNAME-HERE</PublisherDisplayName> <!-- UPDATE PUBLISHER DISPLAY NAME -->
  ```

  to something like:

  ```xml
  <PublisherDisplayName>webextensions.org</PublisherDisplayName> <!-- UPDATE PUBLISHER DISPLAY NAME -->
  ```

- Update the logo images at:

  ```<working-directory>/<extension-name>/edgeextension/manifest/Assets/```

- ```$ manifoldjs package "<path-to-manifolded-edgeextension>/manifest"```

  For example:

  ```$ manifoldjs package "MSGExtensionName/edgeextension/manifest"```

- The package file would be placed at:

  ```<working-directory>/<extension-name>/edgeextension/package/edgeExtension.appx```

### References:

- https://github.com/manifoldjs/manifoldjs-edgeextension

- https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions

- https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging

- https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/creating-and-testing-extension-packages

- http://stackoverflow.com/questions/38803483/how-to-publish-edge-extensions-on-the-windows-store

- http://stackoverflow.com/questions/40694800/how-to-package-and-deploy-ms-edge-extension-to-marketplace
