import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
  StyleProp,
  // Import TextInputProps to potentially inherit other props if needed later
  TextInputProps
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/Colors'; // Adjust path if necessary

// Extend TextInputProps to easily accept all standard TextInput properties
interface InputProps extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value'> {
  label?: string;
  value: string; // Make value explicitly required here
  onChangeText: (text: string) => void; // Make onChangeText explicitly required
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>; // Added errorStyle prop

  // Properties previously defined and also part of TextInputProps:
  // placeholder?: string;
  // secureTextEntry?: boolean;
  // multiline?: boolean;
  // numberOfLines?: number;
  // autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  // keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  // onBlur?: () => void; // Use (e: NativeSyntheticEvent<TextInputFocusEventData>) => void for correct type
  // onFocus?: () => void; // Use (e: NativeSyntheticEvent<TextInputFocusEventData>) => void for correct type

  // ---> ADDED/MODIFIED PROPS <---
  maxLength?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'; // Directly use TextInput's prop type
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle, // Destructure errorStyle
  secureTextEntry, // Destructure secureTextEntry explicitly
  multiline, // Destructure multiline explicitly
  // ---> Destructure the added props <---
  maxLength,
  textAlignVertical,
  onFocus, // Destructure original handlers
  onBlur, // Destructure original handlers
  ...rest // Collect remaining TextInputProps (placeholder, keyboardType, etc.)
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = (e: any) => { // Keep event type basic or import NativeSyntheticEvent etc. if needed
    setIsFocused(true);
    if (onFocus) onFocus(e); // Pass event if needed by consumer
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e); // Pass event if needed by consumer
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && !hasError && styles.focusedInput, // Only apply focus style if no error
          hasError && styles.errorInputBorder,
          disabled && styles.disabledInputContainer,
          // Apply multiline height adjustment here if needed, but TextInput handles height better
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            // Adjust padding dynamically based on icons
            leftIcon ? styles.inputPaddingLeft : {},
            (rightIcon || secureTextEntry) ? styles.inputPaddingRight : {},
            // Apply multiline height here
            multiline ? styles.multilineTextInput : {},
            disabled ? styles.disabledInputText : {}, // Style for disabled text
            inputStyle // Allow overriding with custom style
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.gray[400]}
          // ---> Pass the added props down <---
          maxLength={maxLength}
          // Pass textAlignVertical directly, or use default 'auto'
          // Defaulting to 'top' for multiline might be good UX
          textAlignVertical={textAlignVertical ?? (multiline ? 'top' : 'auto')}
          underlineColorAndroid="transparent" // Remove default Android underline
          {...rest} // Spread other props like placeholder, keyboardType, autoCapitalize etc.
        />

        {/* Password visibility toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
          >
            {isPasswordVisible ?
              <EyeOff size={20} color={colors.gray[600]} /> :
              <Eye size={20} color={colors.gray[600]} />
            }
          </TouchableOpacity>
        )}

        {/* Other right icon (only if not secure entry) */}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {/* Error message */}
      {hasError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.gray[700],
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center for single line
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 50, // Ensure a minimum height for consistency
    overflow: 'hidden', // Clip content if needed
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10, // Adjust padding for vertical centering
    paddingHorizontal: 12, // Base horizontal padding
    fontSize: 16,
    color: colors.gray[900],
    // Remove fixed height, let container and padding define it
  },
  // Adjust padding if icons are present
  inputPaddingLeft: {
    paddingLeft: 0, // Input starts closer to icon
  },
  inputPaddingRight: {
    paddingRight: 0, // Input ends closer to icon
  },
  leftIconContainer: {
    paddingLeft: 12, // Padding for the container holding the icon
    paddingRight: 8, // Space between icon and text input
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: 12, // Padding for the container holding the icon
    paddingLeft: 8, // Space between text input and icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedInput: {
    borderColor: colors.primary,
    // borderWidth: 1.5, // Slightly thicker border on focus (optional)
     // Add shadow for focus effect (optional)
     shadowColor: colors.primary,
     shadowOffset: { width: 0, height: 0 },
     shadowOpacity: 0.3,
     shadowRadius: 3,
     elevation: 2, // Android shadow
  },
  errorInputBorder: {
    borderColor: colors.error,
  },
  disabledInputContainer: {
    backgroundColor: colors.gray[100],
  },
  disabledInputText: {
    color: colors.gray[500], // Dim text color when disabled
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2, // Slight indent
  },
  multilineTextInput: {
     minHeight: 80, // Minimum height for multiline
     paddingTop: 12, // More padding at the top for multiline
     paddingBottom: 12,
     textAlignVertical: 'top', // Default multiline text to top
     // alignItems: 'flex-start' might not be needed on TextInput itself
  },
});

export default Input;