# dep-fitness
Fitness application project for final year project in ATU Galway 2023-2024.

**This branch contains the source code that is implemented in the web version of the application. This includes posture detection mechanism of the application. Some features done separate from this version (e.g. BMI calculator and workflow files) are not implemented for this branch. This version can be visited via [https://dep-fitness.onrender.com/](https://dep-fitness.onrender.com/). For the Android version of the application (which doesn't include the posture detection mechanism), please visit the `main` branch.**

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

## Local Testing
To test out the code locally, do `npm start` or preferrably, `npm android` for Android builds

## Downloading Builds
When a commit is pushed, an Android Build will start automatically via the Actions tab, after which you can get the artifact produced.

