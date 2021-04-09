
## Android Setup

In order to run e2e Detox tests on Android, you'll need to install an AOSP image of Android.

Currently, the latest version of Android that has an official AOSP build is API 29.

We're using Pixel 3a frame/device defaults.

The emulator must also be called `Pixel_3a_API_29`

## iOS Setup

In order to deploy to iOS, you'll need to install:

- XCode
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)
- [Homebrew](https://brew.sh/)
    - `brew install cmake libtool autoconf automake pkg-config libssh2 carthage`

Then, once that's done, you'll need to:

- `cd ios`
- `pod install`
- `carthage update`

## Font Update

We use a custom font for our icons in the app. Some resources for that include:

- https://medium.com/mabiloft/we-designed-an-icon-font-with-figma-and-fontello-and-it-has-not-been-a-piece-of-cake-b2948973738e

Once the files are exported from Figma and downloaded from Icomoon, a few files need to be replaced:

- `assets\fonts\icomoon.ttf` - iOS Font file
- `android\app\src\main\assets\fonts\icomoon.ttf` - Android Font File
- `public\fonts\icomoon.ttf` - Storybook Font File
- `src\components\shark-icon\selection.json` - Icon shortname mapping
