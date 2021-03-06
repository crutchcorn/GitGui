import * as React from 'react';
import {Divider, Menu} from 'react-native-paper';
import {HeaderActionNumber} from './header-action-number/header-action-number';
import {useNavigation} from '@react-navigation/native';
import {RepoHeaderContext} from '@constants';
import {SharkIconButton} from '../shark-icon-button';
import {AppBar} from '../app-bar';
import {SharkMenu} from '../shark-menu';
import {ReduxRepo} from '@entities';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native';

interface RepositoryHeaderProps {
  repo: ReduxRepo | null;
}

export const RepositoryHeader = ({repo}: RepositoryHeaderProps) => {
  const {setActiveDialog, pushPull} = React.useContext(RepoHeaderContext);

  const history = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const {t} = useTranslation();

  const toPush = pushPull?.toPush?.length || 0;
  const toPull = pushPull?.toPull?.length || 0;

  const toPushLabel =
    toPush > 0 ? t('pushCommits', {count: toPush}) : t('pushAction');
  const toPullLabel =
    toPull > 0 ? t('pullCommits', {count: toPull}) : t('pullAction');

  if (!repo) return null;

  return (
    <AppBar
      leftIcon="back"
      leftIconLabel={t('backAction')}
      onLeftSelect={() => history.goBack()}
      headline={repo.name}
      caption="Last fetched: 5min ago"
      rightChild={
        <>
          <HeaderActionNumber
            iconName="push"
            label={toPushLabel}
            val={toPush}
            onPress={() => setActiveDialog('push')}
          />
          <HeaderActionNumber
            iconName="pull"
            label={toPullLabel}
            val={toPull}
            onPress={() => setActiveDialog('pull')}
          />
          <SharkMenu
            visible={isMenuOpen}
            onDismiss={() => setIsMenuOpen(false)}
            anchor={
              <SharkIconButton
                label={t('repoActions')}
                iconName="menu"
                onPress={() => setIsMenuOpen(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setIsMenuOpen(false);
                setActiveDialog('fetch');
              }}
              title={t('fetchAction')}
            />
            <Divider />
            {/* <Menu.Item onPress={() => {}} title="Open Folder" /> */}
            <Menu.Item
              onPress={() => {
                setIsMenuOpen(false);
                setActiveDialog('rename');
              }}
              title={t('renameAction')}
            />
          </SharkMenu>
        </>
      }
    />
  );
};
