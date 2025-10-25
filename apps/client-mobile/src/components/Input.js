import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Icon from 'react-native-vector-icons/FontAwesome';

const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType, 
  leftIcon,
  icon,
  error,
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const iconName = icon || leftIcon;

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputRow,
        isFocused && styles.inputRowFocused,
        error && styles.inputRowError
      ]}>
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon 
              name={iconName} 
              size={18} 
              color={isFocused ? COLORS.primary : COLORS.text.secondary} 
            />
          </View>
        )}
        <TextInput
          style={[styles.input, iconName && { paddingLeft: 0 }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye-slash' : 'eye'} 
              size={18} 
              color={COLORS.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 6,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.card,
    borderWidth: 2,
    borderColor: COLORS.background.divider,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    minHeight: 56,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRowFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow.light,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  inputRowError: {
    borderColor: COLORS.error,
  },
  iconContainer: {
    marginRight: SPACING.sm,
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
    backgroundColor: 'transparent',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default Input;
