import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Buscar", 
  onSubmitEditing, 
  onSearch,
  showFilterButton = false,
  onFilterPress
}) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={COLORS.text.secondary}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSearch}
        activeOpacity={0.8}
      >
        <Icon name="search" size={20} color={COLORS.white} />
      </TouchableOpacity>
      {showFilterButton && (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Icon name="tune" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default SearchBar; 