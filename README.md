# Stat Tracker

This is a mobile app for tracking various daily statistics and personal bests. You can use it for things like work, education, hobbies, health, or whatever it is you can find it useful for in your personal life. It shows personal bests for numeric stats, has various customization options for stat types, allows setting the date and a comment for each entry and more.

## Download

You can download a **WORK IN PROGRESS** build of this app on the [releases page](https://github.com/dmint789/stat-tracker/releases). Keep in mind that future releases could be incompatible with the version you download. However, it will still be possible to change your old backup file to the new format. If you need to have this done, feel free to send an email here: cube327@tuta.io. This disclaimer will be removed once this app reaches version 1.0.

## Support the project

If you would like to support this project, feel free to become a patron on [Patreon](https://patreon.com/denimintsaev). If you don't want to contribute monthly, you can just wait until your first payment goes through at the start of the next month and unsubscribe. Any and all contributions are greatly appreciated!

## Planned features

This is a list of just **some** of the planned features:

1. Tracking PBs for the year/month
2. Tracking worst results
3. Showing past PBs
4. Seeing a history of all PBs
5. Creating formulae that automatically calculate something based on some of the entered numeric stat types

## Screenshots

<img src="https://denimintsaev.com/api/stat_tracker_1.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_2.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_3.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_4.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_5.jpg" width="300"/>

## Setting up the dev environment

In order to set up the dev environment to contribute to this project you will need to have Git, Node 14+, Yarn, Android Studio and JDK11 installed. See further instructions on how to set up the development environment for React Native [here](https://reactnative.dev/docs/environment-setup). Clone this repository and run this command in the root directory of this project:

```
yarn install
```

Run this command in the same directory to start testing your code:

```
yarn dev
```

## Building debug APK

Use these commands to build a debug APK:

```
yarn rn-new-version

yarn debug-apk
```
