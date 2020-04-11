import * as React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import {SharkSubheader} from '../../shark-subheader/shark-subheader';
import {FileChangeListItemWithCheckbox} from '../../file-change-list-item/file-change-list-item-with-checkbox';
import {ChangesArrayItem} from '../../../services/git';
import {theme} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';

interface StagedChangesProps {
  removeFromStaged: (changes: ChangesArrayItem[]) => Promise<void>;
  stagedChanges: ChangesArrayItem[];
  onCommit: () => void;
}

export const StagedChanges = ({
  removeFromStaged,
  stagedChanges,
  onCommit,
}: StagedChangesProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  const history = useNavigation();

  const [selectedStagedChanges, setSelectedStagedChanges] = React.useState<
    ChangesArrayItem[]
  >([]);

  const [showStagedDivider, setShowStagedDivider] = React.useState(false);

  const onStagedScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!event.nativeEvent.contentOffset.y) {
      setShowStagedDivider(false);
      return;
    }
    setShowStagedDivider(true);
  };

  const stagedBtnText = selectedStagedChanges.length ? 'Unstage' : 'Commit All';

  const stagedBtnAction = React.useMemo(() => {
    if (selectedStagedChanges.length) {
      return async () => {
        await removeFromStaged(selectedStagedChanges);
        setSelectedStagedChanges([]);
      };
    }
    return onCommit;
  }, [onCommit, removeFromStaged, selectedStagedChanges]);

  const toggleSelected = (change: ChangesArrayItem) => {
    const filteredUnstaged = selectedStagedChanges.filter(
      isChange => isChange.fileName !== change.fileName,
    );
    // The array does not contain the item
    if (filteredUnstaged.length !== selectedStagedChanges.length) {
      setSelectedStagedChanges(filteredUnstaged);
      return;
    }
    setSelectedStagedChanges([...selectedStagedChanges, change]);
  };

  return (
    <>
      <SharkSubheader
        buttonText={stagedBtnText}
        calloutText={'Staged'}
        onButtonClick={stagedBtnAction}
        style={showStagedDivider ? styles.underlineHeader : {}}
      />
      <ScrollView style={styles.changesList} onScroll={onStagedScroll}>
        {stagedChanges.map(props => {
          const isChecked = !!selectedStagedChanges.find(
            change => change.fileName === props.fileName,
          );
          return (
            <FileChangeListItemWithCheckbox
              isChecked={isChecked}
              key={props.fileName}
              onToggle={() => toggleSelected(props)}
              {...props}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  changesList: {
    paddingHorizontal: 16,
  },
  underlineHeader: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: 1,
  },
});