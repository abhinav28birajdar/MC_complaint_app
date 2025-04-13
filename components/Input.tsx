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
  StyleProp
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: TextStyle;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  onBlur,
  onFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          disabled && styles.disabledInput,
          multiline && styles.multilineInput,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
            multiline ? styles.multilineTextInput : null,
            inputStyle
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.gray[400]}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        
        {secureTextEntry ? (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? 
              <EyeOff size={20} color={colors.gray[500]} /> : 
              <Eye size={20} color={colors.gray[500]} />
            }
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  focusedInput: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  errorInput: {
    borderColor: colors.error,
  },
  disabledInput: {
    backgroundColor: colors.gray[100],
    borderColor: colors.gray[300],
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  multilineInput: {
    minHeight: 100,
  },
  multilineTextInput: {
    minHeight: 100,
  },
});

export default Input;