import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { searchService } from '../services/searchService';

const SearchFilters = ({ filters, onFiltersChange, onApplyFilters }) => {
  const [tempFilters, setTempFilters] = useState(filters);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await searchService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onApplyFilters(tempFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      minStars: undefined,
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
    onApplyFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilters.category !== 'all') count++;
    if (tempFilters.minPrice !== undefined) count++;
    if (tempFilters.maxPrice !== undefined) count++;
    if (tempFilters.minStars !== undefined) count++;
    return count;
  };

  const renderPriceRange = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Rango de Precio</Text>
        <View style={styles.priceInputs}>
          <View style={styles.priceInput}>
            <Text style={styles.priceLabel}>Mínimo</Text>
            <TextInput
              style={styles.input}
              placeholder="$0"
              keyboardType="numeric"
              value={tempFilters.minPrice?.toString() || ''}
              onChangeText={(text) => handleFilterChange('minPrice', text ? parseFloat(text) : undefined)}
            />
          </View>
          <View style={styles.priceInput}>
            <Text style={styles.priceLabel}>Máximo</Text>
            <TextInput
              style={styles.input}
              placeholder="$50"
              keyboardType="numeric"
              value={tempFilters.maxPrice?.toString() || ''}
              onChangeText={(text) => handleFilterChange('maxPrice', text ? parseFloat(text) : undefined)}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderStarsFilter = () => {
    const starOptions = [4.5, 4.0, 3.5, 3.0];
    
    return (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Calificación Mínima</Text>
        <View style={styles.starsContainer}>
          {starOptions.map((stars) => (
            <TouchableOpacity
              key={stars}
              style={[
                styles.starOption,
                tempFilters.minStars === stars && styles.starOptionActive
              ]}
              onPress={() => handleFilterChange('minStars', tempFilters.minStars === stars ? undefined : stars)}
            >
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < Math.floor(stars) ? "star" : index === Math.floor(stars) && stars % 1 !== 0 ? "star-half" : "star-outline"}
                    size={16}
                    color={tempFilters.minStars === stars ? colors.white : colors.primary}
                  />
                ))}
              </View>
              <Text style={[
                styles.starText,
                tempFilters.minStars === stars && styles.starTextActive
              ]}>
                {stars}+
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categorías */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {loadingCategories ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
          ) : (
            <View style={styles.categoriesContainer}>
              {/* Botón "Todas" */}
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  tempFilters.category === 'all' && styles.categoryButtonActive
                ]}
                onPress={() => handleFilterChange('category', 'all')}
              >
                <Ionicons
                  name="restaurant"
                  size={20}
                  color={tempFilters.category === 'all' ? colors.white : colors.primary}
                />
                <Text style={[
                  styles.categoryText,
                  tempFilters.category === 'all' && styles.categoryTextActive
                ]}>
                  Todas
                </Text>
              </TouchableOpacity>
              
              {/* Categorías dinámicas */}
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    tempFilters.category === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => handleFilterChange('category', category.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    tempFilters.category === category.id && styles.categoryTextActive
                  ]}>
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Rango de precio */}
        {renderPriceRange()}

        {/* Calificación */}
        {renderStarsFilter()}
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetFilters}
        >
          <Text style={styles.resetText}>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.applyGradient}
          >
            <Text style={styles.applyText}>
              Aplicar ({getActiveFiltersCount()})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    maxHeight: 350,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    padding: spacing.lg,
    maxHeight: 250,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  priceInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    backgroundColor: colors.white,
  },
  starsContainer: {
    gap: spacing.sm,
  },
  starOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  starOptionActive: {
    backgroundColor: colors.primary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.primary,
  },
  starTextActive: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  resetButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: 'center',
  },
  resetText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.gray,
  },
  applyButton: {
    flex: 2,
  },
  applyGradient: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});

export default SearchFilters; 