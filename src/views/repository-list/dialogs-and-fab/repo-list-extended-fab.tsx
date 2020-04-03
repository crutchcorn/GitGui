import * as React from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {Repo} from '../../../entities';
import {DialogSelection, ExtendedFabBase} from './types';
import {NewRepoFab} from './new-repo-fab';
import {FabActions} from './fab-actions';
import {textStyles} from '../../../constants/text-styles';
import {theme} from '../../../constants/theme';
import {ExtendedActionFab} from '../../../components/extended-action-fab/extended-action-fab';

export interface RepoListExtendedFabProps {
  repos: Repo[] | null;
  isDBLoaded: boolean;
  isLoading: boolean;
  setSelectedAction: (val: DialogSelection | '') => void;
  }
export const RepoListExtendedFab = ({
  isDBLoaded,
  repos,
  setSelectedAction,
  isLoading,
}: RepoListExtendedFabProps) => {
  const fabBottom = React.useRef(new Animated.Value(16));
  const scale = React.useRef(new Animated.Value(0));
  const windowHeight = Dimensions.get('window').height;

  const newRepoFabCB = React.useCallback(
    (toggleAnimation: ExtendedFabBase['toggleAnimation']) => (
      <NewRepoFab toggleAnimation={toggleAnimation} />
    ),
    [],
  );

  const actionFabCB = React.useCallback(
    (toggleAnimation: ExtendedFabBase['toggleAnimation']) => (
      <FabActions
        toggleAnimation={toggleAnimation}
        onSelect={val => setSelectedAction(val)}
      />
    ),
    [],
  );

  React.useEffect(() => {
    if (isLoading) {
      Animated.timing(scale.current, {
        toValue: 0,
        duration: 300,
      }).start();
    } else {
      Animated.timing(scale.current, {
        toValue: 1,
        duration: 300,
      }).start();
    }
  }, [isLoading, scale])

  React.useEffect(() => {
    if (!isDBLoaded) return;
    // There are no repos, show the FAB in the middle of the screen
    if (repos?.length) {
      Animated.timing(fabBottom.current, {
        toValue: 16,
        duration: 300,
      }).start();
    // There are repos, show it 16 from the bottom
    } else {
      Animated.timing(fabBottom.current, {
        toValue: windowHeight / 2 - 80,
        duration: 300,
      }).start();
    }
  }, [fabBottom, repos, isDBLoaded, windowHeight]);

  const noReposBotttom = windowHeight / 2;

  return (
    <>
      {!isLoading && !repos?.length && (
        <Text style={[styles.noRepos, {bottom: noReposBotttom}]}>
          No repositories
        </Text>
      )}
      <View style={styles.fabview}>
        <ExtendedActionFab
          fab={newRepoFabCB}
          fabActions={actionFabCB}
          fabBottom={fabBottom}
          scale={scale}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  noRepos: {
    ...textStyles.headline_01,
    color: theme.colors.on_surface_light,
    opacity: 0.4,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    // Edgecase for parent padding
    // left: 16,
  },
  fabview: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
