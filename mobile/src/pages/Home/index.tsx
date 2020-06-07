import React, { useState, useEffect, useDebugValue } from 'react';
import { View, Image, Text, StyleSheet, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

interface SelectItem {
  label: string;
  value: string;
}

const Home = (): JSX.Element => {
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const loadedUfs = response.data.map(
          (uf: { nome: string; sigla: string }) => ({
            label: uf.nome,
            value: uf.sigla,
          })
        );
        setUfs(loadedUfs);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const loadedCities = response.data.map((city: { nome: string }) => ({
          label: city.nome,
          value: city.nome,
        }));
        setCities(loadedCities);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={styles.background}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu Marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={{ label: 'Selecione um Estado' }}
          itemKey="value"
          onValueChange={(value) => setSelectedUf(value)}
          items={ufs}
          style={{ viewContainer: styles.input }}
        />

        <RNPickerSelect
          placeholder={{ label: 'Selecione uma Cidade' }}
          disabled={selectedUf === ''}
          itemKey="value"
          onValueChange={(value) => setSelectedCity(value)}
          items={cities}
          style={{ viewContainer: styles.input }}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { height: 368, width: 274 },
  button: {
    alignItems: 'center',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    flexDirection: 'row',
    height: 60,
    marginTop: 8,
    overflow: 'hidden',
  },

  buttonIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 60,
    justifyContent: 'center',
    width: 60,
  },

  buttonText: {
    color: '#FFF',
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    justifyContent: 'center',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    padding: 32,
  },

  description: {
    color: '#6C6C80',
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 260,
  },

  footer: {},

  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    fontSize: 16,
    height: 60,
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingTop: 6,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  select: {},

  title: {
    color: '#322153',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 32,
    marginTop: 64,
    maxWidth: 260,
  },
});

export default Home;
