import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const SearchBar = ({ onSearch }) => (
  <View style={styles.container}>
    <TextInput 
      placeholder="Buscar"
      style={styles.input}
      placeholderTextColor={COLORS.text.secondary}
    />
    <TouchableOpacity style={styles.button} onPress={onSearch}>
      <Icon name="search" size={20} color={COLORS.white} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  input: {
    flex: 1,
    height: 54,
    backgroundColor: COLORS.white,
    borderRadius: 27,
    paddingHorizontal: 20,
    marginRight: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.accent,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default SearchBar; 