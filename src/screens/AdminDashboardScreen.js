import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { firebase } from '../../firebase-config';

// Componente resumen de órdenes
const SummaryCard = ({ label, value }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

// Componente placeholder para gráfica de ingresos
const RevenueChart = () => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Total Revenue</Text>
    <Text style={styles.chartValue}>$2,241</Text>
    {/* Aquí iría la gráfica real, por ahora placeholder */}
    <View style={styles.chartPlaceholder} />
    <TouchableOpacity>
      <Text style={styles.link}>See Details</Text>
    </TouchableOpacity>
  </View>
);

// Componente resumen de reseñas
const ReviewSummary = () => (
  <View style={styles.reviewContainer}>
    <Icon name="star" size={24} color="#FF7043" style={{ marginBottom: 4 }} />
    <Text style={styles.reviewScore}>4.9</Text>
    <Text style={styles.reviewText}>Total 20 Reviews</Text>
    <TouchableOpacity>
      <Text style={styles.link}>See All Reviews</Text>
    </TouchableOpacity>
  </View>
);

// Componente productos populares
const PopularItems = () => (
  <View style={styles.popularContainer}>
    <Text style={styles.sectionTitle}>Popular Items This Week</Text>
    <View style={styles.popularItemsRow}>
      <View style={styles.popularItemPlaceholder} />
      <View style={styles.popularItemPlaceholder} />
    </View>
    <TouchableOpacity>
      <Text style={styles.link}>See All</Text>
    </TouchableOpacity>
  </View>
);

// Barra de navegación inferior con iconos reales
const BottomTabBar = () => (
  <View style={styles.tabBar}>
    <TouchableOpacity style={styles.tabBarItem}>
      <Icon name="home" size={22} color="#FF7043" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabBarItem}>
      <Icon name="list-alt" size={22} color="#757575" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabBarItemCenter}>
      <Icon name="plus-circle" size={28} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabBarItem}>
      <Icon name="bell" size={22} color="#757575" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabBarItem}>
      <Icon name="user" size={22} color="#757575" />
    </TouchableOpacity>
  </View>
);

const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (user?.restaurantId) {
        const doc = await firebase.firestore()
          .collection('restaurants')
          .doc(user.restaurantId)
          .get();
        if (doc.exists) {
          setRestaurant(doc.data());
        }
      }
    };
    fetchRestaurant();
  }, [user?.restaurantId]);

  const restaurantName = restaurant?.name || 'Mi Restaurante';

  return (
    <View style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerRestaurant}>{restaurantName}</Text>
          <Text style={styles.headerTitle}>FoodMike</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="cutlery" size={22} color="#FF7043" style={{ marginRight: 10 }} />
          <View style={styles.profileCircle} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Resumen de órdenes */}
        <View style={styles.summaryRow}>
          <SummaryCard label="RUNNING ORDERS" value="20" />
          <SummaryCard label="ORDER REQUEST" value="05" />
        </View>
        {/* Gráfica de ingresos */}
        <RevenueChart />
        {/* Reseñas */}
        <ReviewSummary />
        {/* Productos populares */}
        <PopularItems />
      </ScrollView>
      {/* Barra de navegación inferior */}
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRestaurant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7043',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BDBDBD',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CFD8DC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 20,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  chartPlaceholder: {
    height: 60,
    backgroundColor: '#FFE0B2',
    borderRadius: 8,
    marginBottom: 10,
  },
  link: {
    color: '#FF7043',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
  },
  reviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  reviewScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  reviewText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  popularContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  popularItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  popularItemPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#B0BEC5',
    borderRadius: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
  },
  tabBarItem: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECEFF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarItemCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7043',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboardScreen; 