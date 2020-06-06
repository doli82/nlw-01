import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../../services/api';
import axios from 'axios';

import logo from '../../../assets/logo.svg';
import './styles.css';
import Dropzone from '../../../components/Dropzone';
import SuccessModal from '../../../components/SuccessModal';

interface ContactData {
  name: string;
  email: string;
  whatsapp: string;
}

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFsResponse {
  sigla: string;
}
interface IBGECitiesResponse {
  nome: string;
}
interface OpenStreetMapResponse {
  lat: number;
  lon: number;
}

const CreatePoint = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    if (selectedCity !== '') {
      const uri = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURI(
        `${selectedCity}, ${selectedUf}`
      )}`;
      axios.get<OpenStreetMapResponse[]>(uri).then((response) => {
        setInitialPosition([response.data[0].lat, response.data[0].lon]);
      });
    }
  }, [selectedCity, selectedUf]);

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFsResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    setSelectedCity('');
    axios
      .get<IBGECitiesResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapPosition(event: LeafletMouseEvent) {
    const latlng = event.latlng;
    setSelectedPosition([latlng.lat, latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api
      .post('points', data)
      .then((sucess) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleCloseSuccess();
        }, 3000);
      })
      .catch(() => {
        alert('Falha ao criar o Ponto de coleta!!');
      });
  }

  function handleCloseSuccess() {
    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Nome do ponto de coleta"
              onChange={handleInputChange}
            ></input>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="name">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Seu melhor e-mail"
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                placeholder="(38) 99663322"
                onChange={handleInputChange}
              ></input>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option>Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} id={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option>Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} id={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Map center={initialPosition} zoom={15} onClick={handleMapPosition}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
      {success && (
        <SuccessModal
          show={success}
          message="Cadastro concluído!"
          onCloseAction={handleCloseSuccess}
        />
      )}
    </div>
  );
};

export default CreatePoint;
