import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Filtro from './filtro';
import { useNavigation } from '@react-navigation/native';

export default function Lista() {
  const [data, setData] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const [busqueda, setBusqueda] = useState('');
  const navigation = useNavigation();

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
  };

  let resultados = data;
  if (busqueda.length >= 3 && isNaN(busqueda)) {
    resultados = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  } else if (!isNaN(busqueda) && busqueda !== '') {
    resultados = data.filter(pokemon =>
      pokemon.url.includes('/' + busqueda)
    );
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      if (tipoSeleccionado === 'All') {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const json = await res.json();
        setData(json.results);
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);
        const json = await res.json();
        const listaFiltrada = json.pokemon.map(p => p.pokemon);
        setData(listaFiltrada);
      }
    };
    obtenerDatos();
  }, [tipoSeleccionado]);

  return (
    <ScrollView>
      <View style={styles.lista}>
        {resultados.map((pokemon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => navigation.navigate('Pokemon', { nombre: pokemon.name })}
          >
            <Text>{pokemon.url.split("/")[6]}</Text>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split("/")[6]}.png`
              }}
              style={styles.imagen}
            />
            <Text>{pokemon.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar Pokémon"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <Filtro onTipoChange={setTipoSeleccionado} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 10
  },
  item: {
    marginBottom: 20,
    alignItems: 'center'
  },
  imagen: {
    width: 100,
    height: 100
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});
