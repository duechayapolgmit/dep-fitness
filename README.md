# dep-fitness
Fitness application project for final year project in ATU Galway 2023-2024.

**Note that, due to complications of packaging the application, this version of the application does not contain any MediaPipe functionalities. This includes the posture detection mechanism of the application. You can find existing feature for the web version of the application either in `main-web` branch or on [https://dep-fitness.onrender.com/](https://dep-fitness.onrender.com/) for the live version.**

## Branches
There are three main branches that corresponds to the environment that is setup:
* `main` = main branch of the project, using the production environment, with live code and data
* `staging` = staging branch of the project, using the staging environment, with further testing, simulating the real production environment
* `dev` = development branch of the project, using the development environment, with unit testing and other basic testing

## Getting Started
This application requires these following libraries to build and run:
* Node.JS 20.9.0
* npm 10.2.1
* Java 11 (maybe upgraded)
* Android SDK 34 (auto install via Android Studio)

This application also requires the following programs to run:
* Visual Studio Code
* Android Studio 2022.3.1.20 (for Android builds)

To run the program locally, clone this repository and do `npm install`. To test out the code locally, do `npm start` or preferrably, `npm android` for Android builds

## Downloading Builds
When a commit is pushed, an Android Build will start automatically via the Actions tab, after which you can get the artifact produced.

## Screencast
These are the screencasts from the developers of the project:
* Chayapol Hongsrimuang (Due) - [Screencast](https://atlantictu-my.sharepoint.com/:v:/g/personal/g00388741_atu_ie/EckcXmi8PpVEiw45qPPjo_sB73fMlhcS_v0It7adr0phYw?e=XlKh0q)
