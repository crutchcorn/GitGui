import * as React from 'react';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {theme} from '@constants';
import {DynamicStyleSheet, useDynamicValue} from 'react-native-dynamic';
import {SharkIconButton} from '@components/shark-icon-button';
import {SharkIcon} from '@components/shark-icon';
import {TouchableRipple} from 'react-native-paper';

interface FileActionsBarToggleButtonProps {
  style?: StyleProp<ViewStyle>;
  showMore: boolean;
  animDuration?: number;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileActionsBarToggleButton = ({
  style,
  showMore,
  animDuration = 150,
  setShowMore,
}: FileActionsBarToggleButtonProps) => {
  const styles = useDynamicValue(dynamicStyles);

  const [rotatevalue] = React.useState(new Animated.Value(0));
  const [closeOpacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (showMore) {
      Animated.parallel([
        Animated.timing(rotatevalue, {
          toValue: 1,
          duration: animDuration,
          useNativeDriver: true,
        }),
        Animated.timing(closeOpacity, {
          toValue: 1,
          duration: animDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rotatevalue, {
          toValue: 0,
          duration: animDuration,
          useNativeDriver: true,
        }),
        Animated.timing(closeOpacity, {
          toValue: 0,
          duration: animDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMore, rotatevalue, animDuration, closeOpacity]);

  const rotation = rotatevalue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableRipple
      style={[styles.iconContainer, style]}
      accessible={true}
      accessibilityRole={'button'}
      accessibilityLabel={'File actions'}
      accessibilityState={{
        expanded: showMore,
      }}
      onPress={() => setShowMore(v => !v)}>
      <View style={styles.iconButton}>
        <SharkIcon
          iconName="menu"
          style={{
            transform: [{rotate: rotation}],
          }}
        />
        <Animated.View
          style={[
            styles.closeIconContainer,
            styles.iconButton,
            {opacity: closeOpacity},
          ]}>
          <SharkIcon
            iconName="close"
            style={{
              transform: [{rotate: rotation}],
            }}
          />
        </Animated.View>
      </View>
    </TouchableRipple>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  iconContainer: {
    position: 'relative',
  },
  iconButton: {
    backgroundColor: theme.colors.floating_surface,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
