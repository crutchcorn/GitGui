import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CommitList} from '@components/commit-list';
import {HistoryBranchDropdown} from './components/history-branch-dropdown';
import {OverlayDropdownContent} from '@components/overlay-dropdown-content';
import {RepositoryHeader} from '@components/repository-header';
import {ReduxRepo} from '@entities';
import {GitLogCommit} from '@services';
import {useTranslation} from 'react-i18next';

export interface RepositoryHistoryUIProps {
  commits: any[];
  branchName: string;
  onCommitNavigate: (commit: GitLogCommit) => void;
  topLayer: React.ReactNode;
  repo: ReduxRepo | null;
  error: string;
  sideElement: React.ReactNode;
}

export const RepositoryHistoryUI = ({
  commits,
  onCommitNavigate,
  topLayer,
  repo,
  branchName,
  error,
  sideElement,
}: RepositoryHistoryUIProps) => {
  const {t} = useTranslation();

  const [showBranches, setShowBranches] = React.useState(false);

  const bottomLayer = React.useMemo(() => {
    if (error) {
      return (
        <View>
          <Text>{t('commitLogErrStr')}</Text>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <CommitList commits={commits} onPress={onCommitNavigate} repo={repo!} />
    );
  }, [error, commits, onCommitNavigate, repo, t]);

  const header = React.useMemo(
    () => (
      <HistoryBranchDropdown
        onFavorite={() => {}}
        setExpanded={setShowBranches}
        expanded={showBranches}
        favorite={false}
        branchName={branchName}
      />
    ),
    [setShowBranches, showBranches, branchName],
  );

  // console.log(stackElement);

  return (
    <>
      <RepositoryHeader repo={repo} />
      <View style={styles.container}>
        <View style={styles.historyUIContainer}>
          <OverlayDropdownContent
            header={header}
            expanded={showBranches}
            topLayer={topLayer}
            bottomLayer={bottomLayer}
          />
        </View>
        {sideElement}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  historyUIContainer: {
    flex: 1,
  },
});
