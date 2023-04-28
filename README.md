# CODE Review introduces: CODE Connect - Campus reloaded

## Download links

- [Apple app store](https://apps.apple.com/app/code-connect/id1673533815)
- [Google play store](https://play.google.com/store/apps/details?id=berlin.code.codeconnect)

## About

Previously, room booking at CODE was handled through eiter the cumbersome Google Calendar or the confusing Factory Berlin app.
CODE Connection makes booking easier and more accessible to students by focusing on being able to quickly secure a room for an upcoming working session or meeting.

**DISCLAIMER: Even though CODE Connect is produced by and for CODE students, it is not officially associated with CODE University of Applied Sciences!**

![signed out screen](https://is3-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/c8/67/a6/c867a616-fd31-7cb2-52df-359eea6ec7d2/f25d40dc-bb71-4d82-a8d8-5c737c5be384_Simulator_Screen_Shot_-_iPhone_14_Plus_-_2023-02-26_at_01.18.02.png/400x800bb.png)

![meeting booked screen](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/a3/f9/d2/a3f9d2da-1d6d-f0df-c657-07241bf8f752/52ef0044-ba31-40c0-b2d9-7d51737bab27_Simulator_Screen_Shot_-_iPhone_14_Plus_-_2023-02-26_at_01.19.25.png/400x800bb.png)

### Features

- View the state of rooms on campus
- Book rooms by interacting with the Google Calendar Api
- WIP: See where and when academic events are occurring
- PLANNED: apple homescreen widget with the map and your room schedule

## Repository structure

```
.
├── assets/        images and fonts
├── components/    react components
├── constants/     react native styling constants
├── contexts/      react contexts
├── controller/    hooks that encapsulate business logic grouped by features
├── data/          configuration data for app behaviour (feature flags, constants, room data)
├── googleClient/  the types and logic for interacting with the google api
├── hooks/         util hooks
├── navigation/    registering the different routes
├── screens/       screens representing a route
├── services/      classes that encapsulate business logic grouped by features
└── test/          unused ;)
```

## Setup

### Development setup

#### For IOS (only works on macOS)

1. clone the repo: `$ git clone https://github.com/CODE-Review-Newspaper/mobile-app`.

2. run `$ npm i` to install dependencies and enable intellisense in your code editor.

3. run `$ npm run ios` to start development in a Xcode device simulator.

#### For Android

1. clone the repo: `$ git clone https://github.com/CODE-Review-Newspaper/mobile-app`.

2. run `$ npm i` to install dependencies and enable intellisense in your code editor.

3. run `$ npm run android` to start development in a Xcode device simulator.

### Tested with

- MacBook Air (M2, 2022), running macOS Ventura (v13.3.1)
- Xcode (v14.3)

### Prerequisites

- Xcode (for IOS) ([https://apps.apple.com/us/app/xcode/id497799835](https://apps.apple.com/us/app/xcode/id497799835))
- Java (for Android) ([https://www.java.com/download/ie_manual.jsp](https://www.java.com/download/ie_manual.jsp))