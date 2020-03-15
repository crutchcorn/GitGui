import * as React from 'react';
import {
  StyleSheet,
  View,
  TextProps,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {textStyles} from '../../constants/text-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../constants/theme';

interface SharkTextInputProps {
  placeholder: string;
  prefixIcon?: string;
  postfixIcon?: string;
  ellipsizeMode?: TextProps['ellipsizeMode'];
  numberOfLines?: TextProps['numberOfLines'];
  value: TextInputProps['value'];
  onChangeText: TextInputProps['onChangeText'];
  style?: StyleProp<ViewStyle>;
}
export const SharkTextInput = ({
  placeholder,
  prefixIcon,
  postfixIcon,
  numberOfLines,
  value,
  onChangeText,
  style = {},
}: SharkTextInputProps) => {
  const paddingLeft = !!prefixIcon ? 0 : 12;
  const paddingRight = !!postfixIcon ? 0 : 12;
  const paddingVert = !!prefixIcon || !!postfixIcon ? 8 : 16;

  const padding = {
    paddingLeft,
    paddingRight,
    paddingTop: paddingVert,
    paddingBottom: paddingVert,
  };

  return (
    <View style={[styles.textInputContainer, padding, style]}>
      {!!prefixIcon && (
        <Icon
          size={24}
          name={prefixIcon}
          color={theme.colors.on_surface_secondary_light}
          style={styles.icon}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.textInput}
        numberOfLines={numberOfLines}
      />
      {!!postfixIcon && (
        <Icon
          size={24}
          name={postfixIcon}
          color={theme.colors.accent}
          style={styles.icon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    borderColor: theme.colors.outlineColor,
    borderWidth: 1,
    borderRadius: theme.roundness,
    alignContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    marginHorizontal: 4,
    padding: 8,
  },
  textInput: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    padding: 0,
    ...textStyles.body_01,
  },
});
