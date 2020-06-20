import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {CommitList} from '@components/commit-list';
import {HistoryBranchDropdown} from './components/history-branch-dropdown';
import {OverlayDropdownContent} from '@components/overlay-dropdown-content';
import {RepositoryHeader} from '@components/repository-header';
import {ReduxRepo} from '@entities';
import {GitLogCommit} from '@services';

interface RepositoryHistoryUIProps {
  commits: any[];
  onCommitNavigate: (commit: GitLogCommit) => void;
  topLayer: React.ReactNode;
  repo: ReduxRepo | null;
}
export const RepositoryHistoryUI = ({
  commits,
  onCommitNavigate,
  topLayer,
  repo,
}: RepositoryHistoryUIProps) => {
  const [showBranches, setShowBranches] = React.useState(false);

  const bottomLayer = React.useMemo(
    () => <CommitList commits={commits} onPress={onCommitNavigate} />,
    [commits, onCommitNavigate],
  );

  const header = React.useMemo(
    () => (
      <HistoryBranchDropdown
        onFavorite={() => {}}
        setExpanded={setShowBranches}
        expanded={showBranches}
        favorite={false}
        branchName={'the_big_branch'}
      />
    ),
    [setShowBranches, showBranches],
  );

  return (
    <>
      <RepositoryHeader repo={repo} />
      <View style={styles.container}>
        <OverlayDropdownContent
          header={header}
          expanded={showBranches}
          topLayer={topLayer}
          bottomLayer={bottomLayer}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});