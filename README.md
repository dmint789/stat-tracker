# Stat Tracker

Mobile app for tracking various statistics, like things related to work, education, hobbies, health, etc. Can be used for writing down daily statistics, like weight, gym exercises, new entries related to your hobbies, and so on.

## Download

You can download a WORK IN PROGRESS build of this app on the [releases page](https://github.com/dmint789/stat-tracker/releases). Keep in mind that future releases could be incompatible with the version you download. However, it will still be possible to change your old backup file to the new format if and when the format changes. This disclaimer will be removed once this app reaches version 1.0.

## Setting Up The Dev Environment

In order to set up the dev environment to contribute to this project you will need to have git, node and yarn installed. Pull this repository and run this command in the root directory of this project:

```
yarn install
```

## Building Debug APK

In order to build a debug APK file, use this command:

```
yarn debug-apk
```

## Building Release APK

In order to build a release APK file you will need to generate a keystore, place the file in the `android/app` directory, and also create a `keystore.properties` file with the following contents:

```
storePassword=[YOUR KEYSTORE PASSWORD]
keyPassword=[YOUR KEY PASSWORD (may be the same as the one above)]
keyAlias=[YOUR KEY ALIAS]
storeFile=[NAME OF YOUR KEYSTORE FILE].keystore
```

Then use this command:

```
yarn release-apk
```
