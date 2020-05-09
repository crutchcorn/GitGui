import * as React from 'react';
import {View, Button} from 'react-native';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {CommitDetailsHeader} from '../../components/commit-details-header';

export const CommitDetails = () => {
  const [headerExpanded, setHeaderExpanded] = React.useState(false);
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View style={styles.container}>
      <CommitDetailsHeader
        expanded={headerExpanded}
        setExpanded={setHeaderExpanded}
      />
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {},
});
