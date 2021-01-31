import * as React from 'react';
import 'reflect-metadata';
import {Provider as PaperProvider, Portal} from 'react-native-paper';

import {
  Button,
  LogBox,
  Platform,
  StatusBar,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {RepositoryList} from './views/repository-list/repository-list';
import {Repository} from './views/repository/repository';
import {Account} from './views/account/account';
import {Settings} from './views/settings/settings';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  darkNavTheme,
  darkPaperTheme,
  lightNavTheme,
  lightPaperTheme,
  StagingTypes,
  StyleOfStagingContext,
  UserContext,
  DARK_MODE_STORAGE_KEY,
  DarkModeOptionTypes,
  SetDarkModeContext,
  STAGING_STYLE_STORAGE_KEY,
} from '@constants';
import {ColorSchemeProvider} from 'react-native-dynamic';
import DefaultPreference from 'react-native-default-preference';
import {
  useGetAndroidPermissions,
  useGitHubUserData,
  useManualUserData,
  useThunkDispatch,
} from '@hooks';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {changeBarColors} from 'react-native-immersive-bars';
import {Provider} from 'react-redux';
import {store, setupDatabase} from '@store';
import ErrorBoundary from 'react-native-error-boundary';

import './services/translations';

// TODO: Remove once https://github.com/isomorphic-git/isomorphic-git/pull/1156
// @ts-ignore
// eslint-disable-next-line no-undef
CompressionStream = null;

LogBox.ignoreLogs([
  /**
   * This is in place due to dependencies. Remove this once dep updates
   * https://github.com/react-navigation/react-navigation/issues/7933#issuecomment-608283552
   */
  'Calling `getNode()` on the ref of an Animated component is no longer necessary. You can now directly use the ref instead.',
  /**
   * I solumnly swear to handle all instances where serializable values are found in the navigation state and to use safegaurds
   * to move users back to places they're familiar with. Right now, this is only used for the commit screen and we move
   * the user back to the history screen if they're deep linked to that location somehow
   * https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
   */
  'Non-serializable values were found in the navigation state',
  'A DynamicStyleSheet was used without any DynamicValues. Consider replacing with a regular StyleSheet.',
]);

const AppBase = () => {
  const dispatch = useThunkDispatch();

  /**
   * Database
   */
  React.useEffect(() => {
    dispatch(setupDatabase());
  }, [dispatch]);

  /**
   * Get user deep linking
   */
  const {
    gitHubUser,
    setUseGithub,
    useGitHub,
    logoutGitHub,
  } = useGitHubUserData();

  const {manualUser, setManualUser} = useManualUserData();

  /**
   * Get permissions to read/write from SD card
   */
  useGetAndroidPermissions();

  /**
   * User settings
   */
  const [styleOfStaging, setStyleOfStaging] = React.useState<StagingTypes>(
    'split',
  );

  const [localDarkMode, setLocalDarkMode] = React.useState<DarkModeOptionTypes>(
    'auto',
  );

  const systemColorTheme = useColorScheme();
  const isSystemDarkMode = systemColorTheme === 'dark';

  const isDarkMode =
    localDarkMode === 'auto' ? isSystemDarkMode : localDarkMode === 'dark';

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      changeBarColors(isDarkMode);
    }
  }, [isDarkMode]);

  React.useEffect(() => {
    DefaultPreference.get(STAGING_STYLE_STORAGE_KEY).then(val => {
      if (val) {
        setStyleOfStaging(val as StagingTypes);
      }
    });
    DefaultPreference.get(DARK_MODE_STORAGE_KEY).then(val => {
      if (val) {
        setLocalDarkMode(val as DarkModeOptionTypes);
      }
    });
  }, []);

  const updateStagingStyle = (val: StagingTypes) => {
    DefaultPreference.set(STAGING_STYLE_STORAGE_KEY, val);
    setStyleOfStaging(val);
  };

  const updateLocalDarkMode = (val: DarkModeOptionTypes) => {
    DefaultPreference.set(DARK_MODE_STORAGE_KEY, val);
    setLocalDarkMode(val);
  };

  const Stack = createStackNavigator();

  const paperTheme = isDarkMode ? darkPaperTheme : lightPaperTheme;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDarkMode ? darkNavTheme : lightNavTheme}>
        <PaperProvider theme={paperTheme}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={'transparent'}
          />
          <StyleOfStagingContext.Provider
            value={{
              styleOfStaging,
              setStyleOfStaging: updateStagingStyle,
            }}>
            <SetDarkModeContext.Provider
              value={{
                setDarkMode: updateLocalDarkMode,
                localDarkMode,
              }}>
              <UserContext.Provider
                value={{
                  gitHubUser,
                  setUseGithub,
                  useGitHub,
                  manualUser,
                  setManualUser,
                  logoutGitHub,
                }}>
                <ColorSchemeProvider mode={isDarkMode ? 'dark' : 'light'}>
                  <Portal.Host>
                    <Stack.Navigator headerMode={'none'}>
                      <Stack.Screen
                        name="RepoList"
                        component={RepositoryList}
                      />
                      <Stack.Screen name="Settings" component={Settings} />
                      <Stack.Screen name="Account" component={Account} />
                      <Stack.Screen name="RepoDetails" component={Repository} />
                    </Stack.Navigator>
                  </Portal.Host>
                </ColorSchemeProvider>
              </UserContext.Provider>
            </SetDarkModeContext.Provider>
          </StyleOfStagingContext.Provider>
        </PaperProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const CustomFallback = (props: {error: Error; resetError: () => void}) => (
  <View>
    <Text>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    <Button onPress={props.resetError} title={'Try again'} />
  </View>
);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <Provider store={store}>
        <AppBase />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
