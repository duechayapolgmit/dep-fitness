# dep-fitness
Fitness application project for final year project in ATU Galway 2023-2024.

## Getting Started
This application requires these following libraries to build and run:
* Node.JS 20.9.0
* npm 10.2.1
* Java 11 (maybe upgraded)
* Android SDK 34 (auto install via Android Studio)

This application also requires the following programs to run:
* Visual Studio Code
* Android Studio 2022.3.1.20 (for Android builds)

## Local Testing
To test out the code locally, do `npm start` or preferrably, `npm android` for Android builds

## Downloading Builds
When a commit is pushed, an Android Build will start automatically via the Actions tab, after which you can get the artifact produced. 

To use that artifact, rename the unformatted file in the zip file (in this case, `app-build`) to `app-build.apk`. Then, drag and drop the .apk file to the emulator or transfer it to your device. This is currently the temporarily solution for getting builds from GitHub Actions.