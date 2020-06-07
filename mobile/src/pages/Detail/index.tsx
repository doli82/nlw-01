import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Item {
  title: string;
}

interface Data {
  point: {
    name: string;
    image: string;
    image_url: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: Item[];
}

const Detail = (): JSX.Element | null => {
  const [data, setData] = useState<Data>({} as Data);
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api
      .get(`points/${routeParams.point_id}`)
      .then((response) => setData(response.data));
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }
  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  }
  function handleSendWhatsappMessage() {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta de resíduos`
    );
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={styles.areaView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34cb79" size={24} />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image_url,
          }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map((item) => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {`${data.point.city}, ${data.point.uf}`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleSendWhatsappMessage}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  address: {
    marginTop: 32,
  },
  addressContent: {
    color: '#6C6C80',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  areaView: {
    flex: 1,
    paddingTop: 16,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    width: '48%',
  },

  buttonText: {
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    marginLeft: 8,
  },

  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  footer: {
    borderColor: '#999',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },

  pointImage: {
    borderRadius: 10,
    height: 120,
    marginTop: 32,
    resizeMode: 'cover',
    width: '100%',
  },

  pointItems: {
    color: '#6C6C80',
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },

  pointName: {
    color: '#322153',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 28,
    marginTop: 24,
  },
});

export default Detail;
