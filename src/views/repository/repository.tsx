import * as React from 'react';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {clearRepo, findRepo, RootState} from '@store';
import {useThunkDispatch} from '@hooks';
import {RepositoryUI} from './repository.ui';
import {RepositoryChanges} from '../repository-changes/repository-changes';
import {RepositoryHistory} from '../repository-history/repository-history';
import {CommitAction} from '../commit-action/commit-action';
import {CommitDetails} from '../commit-details/commit-details';
import {renameRepo, findTrackedRemoteBranch} from '@services';
import {Remotes} from '@types';
import {OnFetchActionsDialog} from './components/on-fetch-action-dialog';
import {OnPushActionsDialog} from './components/on-push-action-dialog';
import {RemoteBranch} from '@types';
import {OnPullActionsDialog} from './components/on-pull-action-dialog';

interface FetchDialogType {
  action: 'fetch';
  data: {
    remote: Remotes;
    fetchAll: boolean;
    prune: boolean;
  };
}

interface PushDialogType {
  action: 'push';
  data: {
    destination: RemoteBranch;
    forcePush: boolean;
    branch: string;
  };
}

interface PullDialogType {
  action: 'pull';
  data: null;
}

type DialogType = FetchDialogType | PushDialogType | PullDialogType | null;

export const Repository = () => {
  const dispatch = useThunkDispatch();

  const {repo, toPushPull} = useSelector(
    (state: RootState) => state.repository,
  );
  const {remotes, localBranches, remoteBranches} = useSelector(
    (state: RootState) => state.branches,
  );

  const [trackedBranch, setTrackedBranch] = React.useState<RemoteBranch | null>(
    null,
  );

  React.useEffect(() => {
    if (!repo) return;
    findTrackedRemoteBranch({
      branchName: repo!.currentBranchName,
      path: repo!.path,
      remoteBranches,
    }).then(v => setTrackedBranch(v));
  }, [remoteBranches, repo]);

  const [dialogType, setDialogType] = React.useState<DialogType>();

  const {params} = useRoute();
  const {repoId} = params! as Record<string, string>;

  React.useEffect(() => {
    dispatch(findRepo(repoId)).then(console.log);

    return () => {
      // When repo is exited, we need to dispatch a clearing of the repo data
      dispatch(clearRepo());
    };
  }, [repoId, dispatch]);

  if (!repo) return null;

  return (
    <>
      <RepositoryUI
        currentBranch={repo?.currentBranchName || ''}
        trackedBranch={trackedBranch}
        remotes={remotes}
        localBranches={localBranches}
        remoteBranches={remoteBranches}
        repoChanges={RepositoryChanges}
        repoHistory={RepositoryHistory}
        commitActions={CommitAction}
        pushPull={toPushPull}
        onRename={newName =>
          renameRepo({repoId: repo.id, name: newName, dispatch}).then(() =>
            findRepo(repoId),
          )
        }
        onPull={() => {
          setDialogType({
            action: 'pull',
            data: null,
          });
        }}
        onPush={data =>
          setDialogType({
            action: 'push',
            data,
          })
        }
        onFetch={data =>
          setDialogType({
            action: 'fetch',
            data,
          })
        }
      />
      <OnFetchActionsDialog
        visible={dialogType?.action === 'fetch'}
        data={dialogType?.data as FetchDialogType['data']}
        dispatch={dispatch}
        repo={repo}
        onDismiss={() => {
          setDialogType(null);
        }}
      />
      <OnPushActionsDialog
        visible={dialogType?.action === 'push'}
        data={dialogType?.data as PushDialogType['data']}
        dispatch={dispatch}
        repo={repo}
        onDismiss={() => {
          setDialogType(null);
        }}
      />
      <OnPullActionsDialog
        visible={dialogType?.action === 'pull'}
        dispatch={dispatch}
        repo={repo}
        trackedBranch={trackedBranch!}
        onDismiss={() => {
          setDialogType(null);
        }}
      />
    </>
  );
};
