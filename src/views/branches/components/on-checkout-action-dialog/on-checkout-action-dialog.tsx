import * as React from 'react';
import {checkoutBranch} from '@services';
import {ProgressErrorDialog} from '@components/progress-error-dialog';
import {ReduxRepo} from '@entities';
import {ThunkDispatchType} from '@hooks';
import {useTranslation} from 'react-i18next';

const pauseToRender = () => new Promise(resolve => setTimeout(resolve, 0));

interface OnCheckoutActionsDialogProps {
  onDismiss: (didUpdate: boolean) => void;
  visible: boolean;
  repo: ReduxRepo;
  branchName: string;
  dispatch: ThunkDispatchType;
  remote: false | string;
}

export const OnCheckoutActionsDialog = ({
  onDismiss,
  visible,
  repo,
  branchName,
  dispatch,
  remote,
}: OnCheckoutActionsDialogProps) => {
  const {t} = useTranslation();

  const [errorStr, setErrorStr] = React.useState('');

  /**
   * The state of the clone itself
   */
  const [loaded, setLoaded] = React.useState(0);
  const [total, setTotal] = React.useState(-1);
  const [phase, setPhase] = React.useState('');

  const fetchCB = React.useCallback(() => {
    setErrorStr('');
    checkoutBranch({
      branchName,
      dispatch,
      repo,
      remote,
      async onProgress({
        phase: progressPhase,
        loaded: progressLoaded,
        total: progressTotal,
      }) {
        setPhase(progressPhase);
        setLoaded(progressLoaded);
        setTotal(progressTotal || 0);
        await pauseToRender();
      },
    })
      .then(() => {
        onDismiss(true);
      })
      .catch((e: Error | string) => {
        setErrorStr((e as Error).message || (e as string));
      });
  }, [remote, branchName, repo, dispatch, onDismiss]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }
    fetchCB();
  }, [fetchCB, visible]);

  return (
    <ProgressErrorDialog
      headerStr={t('onCheckoutDialogTitle')}
      errorBodyText={t('onCheckoutDialogText')}
      onDismiss={onDismiss}
      onRetry={() => fetchCB()}
      visible={visible}
      progress={total > 0 ? loaded / total : 0}
      indeterminate={!total}
      bodyText={phase}
      errorStr={errorStr}
    />
  );
};
