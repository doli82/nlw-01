import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}
interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}
interface Params {
  uf: string;
  city: string;
}

const Points = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Oooops...',
          'Precisamos de sua permissão para obter a localização'
        );
        return;
      }
      // const currentLocation = await Location.getCurrentPositionAsync();
      const location = await Location.geocodeAsync(
        `${routeParams.city}, ${routeParams.uf}`
      );
      const { latitude, longitude } = location[0];
      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, []);

  useEffect(() => {
    api.get('items').then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    api
      .get('points', {
        params: {
          uf: routeParams.uf,
          city: routeParams.city,
          items: selectedItems.length ? selectedItems : 0,
        },
      })
      .then((response) => setPoints(response.data));
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }
  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
        <Icon name="arrow-left" color="#34cb79" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindo.</Text>
      <Text style={styles.description}>
        Encontre no mapa um ponto de coleta.
      </Text>

      <View style={styles.mapContainer}>
        {initialPosition[0] !== 0 && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            {points.map((point) => (
              <Marker
                key={String(point.id)}
                onPress={() => handleNavigateToDetail(point.id)}
                style={styles.mapMarker}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
              >
                <View style={styles.mapMarkerContainer}>
                  <Image
                    style={styles.mapMarkerImage}
                    source={{
                      uri: point.image_url,
                    }}
                  />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              activeOpacity={0.6}
              onPress={() => handleSelectItem(item.id)}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },
  description: {
    color: '#6C6C80',
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 4,
  },

  item: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderRadius: 8,
    borderWidth: 2,
    height: 120,
    justifyContent: 'space-between',
    marginRight: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    textAlign: 'center',

    width: 120,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    textAlign: 'center',
  },

  itemsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    marginTop: 16,
  },

  map: {
    height: '100%',
    width: '100%',
  },

  mapContainer: {
    borderRadius: 10,
    flex: 1,
    marginTop: 16,
    overflow: 'hidden',
    width: '100%',
  },

  mapMarker: {
    height: 80,
    width: 90,
  },

  mapMarkerContainer: {
    alignItems: 'center',
    backgroundColor: '#34CB79',
    borderRadius: 8,
    flexDirection: 'column',
    height: 70,
    overflow: 'hidden',
    width: 90,
  },

  mapMarkerImage: {
    height: 45,
    resizeMode: 'cover',
    width: 90,
  },

  mapMarkerTitle: {
    color: '#FFF',
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    lineHeight: 23,
  },

  scrollView: {
    paddingHorizontal: 16,
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  title: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 20,
    marginTop: 24,
  },
});

export default Points;
