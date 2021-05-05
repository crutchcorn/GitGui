const config = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'SPECIFY_PATH_TO_YOUR_APP_BINARY',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 11',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_29',
      },
      utilBinaryPaths: ['cache/test-butler-app.apk'],
    },
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};

module.exports = config;
