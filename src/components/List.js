import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Card from './Card';

const List = ({ 
  data, 
  renderItem, 
  keyExtractor,
  style,
  ListHeaderComponent,
  ListEmptyComponent,
  onRefresh,
  refreshing = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  ...flatListProps
}) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={[styles.list, style]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      {...flatListProps}
    />
  );
};

const ListItem = ({ 
  title, 
  subtitle, 
  icon, 
  iconColor = COLORS.primary,
  onPress, 
  rightIcon,
  rightText,
  style,
  disabled = false
}) => {
  const ItemComponent = onPress ? TouchableOpacity : View;
  
  return (
    <ItemComponent 
      style={[styles.listItem, style]} 
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <Icon name={icon} size={20} color={iconColor} style={styles.itemIcon} />
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      {rightIcon && <Icon name={rightIcon} size={16} color={COLORS.gray} />}
    </ItemComponent>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xs,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemIcon: {
    marginRight: SPACING.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  rightText: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: SPACING.sm,
  },
});

export { List, ListItem }; 