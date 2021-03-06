import {StyleProp, Text, View, ViewStyle} from 'react-native';
import * as React from 'react';
import {Icon} from '@components/shark-icon';
import {theme} from '@constants';
import {DynamicStyleSheet, useDynamicValue} from 'react-native-dynamic';

interface PushPullArrowsProps {
  commitsToPull: string[];
  commitsToPush: string[];
  style?: StyleProp<ViewStyle>;
  primaryText?: boolean;
}

export const PushPullArrows = ({
  commitsToPull,
  commitsToPush,
  style = {},
  primaryText = true,
}: PushPullArrowsProps) => {
  const styles = useDynamicValue(dynamicStyles);
  const accent = useDynamicValue(theme.colors.primary);
  const label_high_emphasis = useDynamicValue(theme.colors.label_high_emphasis);
  if (!commitsToPull?.length && !commitsToPush?.length) {
    return null;
  }
  const color = primaryText ? accent : label_high_emphasis;
  return (
    <View style={[styles.arrowContainer, style]}>
      {!!commitsToPush?.length && (
        <View style={styles.commitNumberView}>
          <Icon name="arrow_up" size={10} color={color} />
          <Text style={[styles.commitNumberText, {color}]}>
            {commitsToPush.length}
          </Text>
        </View>
      )}
      {!!commitsToPush?.length && !!commitsToPull?.length && (
        <View style={styles.middleLine} />
      )}
      {!!commitsToPull?.length && (
        <View style={styles.commitNumberView}>
          <Icon name="arrow_down" size={10} color={color} />
          <Text style={[styles.commitNumberText, {color}]}>
            {commitsToPull.length}
          </Text>
        </View>
      )}
    </View>
  );
};

export const dynamicStyles = new DynamicStyleSheet({
  arrowContainer: {
    flexDirection: 'row',
  },
  middleLine: {
    width: 1,
    backgroundColor: theme.colors.tint_on_surface_01,
  },
  commitNumberView: {
    paddingHorizontal: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commitNumberText: {
    marginLeft: 2,
    ...theme.textStyles.overline_01,
  },
  primaryText: {
    color: theme.colors.primary,
  },
});
