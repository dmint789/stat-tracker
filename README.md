# Stat Tracker

This is a mobile app for tracking various daily statistics and personal bests. You can use it for things like sports, work, education, hobbies, health, or whatever it is you can find it useful for in your personal life. It shows personal bests for numeric stats, has the option to enter times, has various customization options for stat types, allows setting the date and a comment for each entry and more.

## Download

You can download a **WORK IN PROGRESS** build of this app on the [releases page](https://github.com/dmint789/stat-tracker/releases). Keep in mind that future releases could be incompatible with the version you download. However, it will still be possible to change your old backup file to the new format. If you need to have this done, feel free to send an email here: cube327@tuta.io. This disclaimer will be removed once this app reaches version 1.0.

## Support the project

If you would like to support this project, feel free to become a patron on [Patreon](https://patreon.com/denimintsaev). If you don't want to contribute monthly, you can just wait until your first payment goes through at the start of the next month and unsubscribe. Any and all contributions are greatly appreciated!

## Planned features

This is a list of just **some** of the planned features:

1. Adding customization options for stat categories
2. Add search functionality
3. Tracking worst results
4. Showing past PBs
5. Seeing a history of all PBs
6. Creating formulae that automatically calculate something based on some of the entered numeric stat types
7. Display graphs/bar charts showing data from all entries

## Screenshots

<img src="https://denimintsaev.com/api/stat_tracker_1.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_2.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_3.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_4.jpg" width="300"/>

<img src="https://denimintsaev.com/api/stat_tracker_5.jpg" width="300"/>

## Setting up the dev environment

In order to set up the dev environment to contribute to this project you will need to have Git, Node 14+, Yarn, Android Studio and JDK11 installed. See further instructions on how to set up the development environment for React Native [here](https://reactnative.dev/docs/environment-setup). Clone this repository and run this command in the root directory of this project:

```shell
yarn install
```

Run these commands in the same directory, but in different terminal windows, to start testing your code:

```shell
yarn emulator

# Once the emulator is running, run this command
yarn start

# Give the "yarn start" command time until you see "Welcome to Metro"
yarn android
```

## Automated testing

Use this command to run all automated tests:

```shell
yarn test
```

Please do not submit PRs that break any of the automated tests, unless you believe that there is an issue with one of them or that one of them needs to be updated.

## Building debug APK

Use these commands to build a debug APK:

```shell
# This uses the version number found in the package.json file
yarn rn-new-version

yarn debug-apk
```
