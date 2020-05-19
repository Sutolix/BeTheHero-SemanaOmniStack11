import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, FlatList, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

import api from '../../services/api'

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation()

  function navigateToDetail(incident) {
    //nome da rota
    navigation.navigate('Detail', { incident })
  }

  async function loadingIncidents() {

    //para que não sejam feitas várias requisições ao mesmo tempo (como por exemplo se o usuário ficar puxando várias vezes pra baixo)
    if (loading) {
      return
    }

    //para caso já se tenha todos os casos carregados não fazer mais requisições do tipo
    if (total > 0 && incidents.length === total) {
      return
    }

    setLoading(true)

    const response = await api.get('incidents', {
      params: { page }
    })

    //Anexa os dois vetores para que ao rolar apareçam mais casos criando assim um "display infinito"
    setIncidents([...incidents, ...response.data])
    //o total de casos vem pelo header chamado x-total-count (feito no backend)
    setTotal(response.headers['x-total-count'])
    setPage(page + 1)
    setLoading(false)
  }

  useEffect(() => {
    loadingIncidents()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>


      {(incidents.length === 0) ? (

        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#e02041"
          hidesWhenStopped
        />
      ) : (
          <FlatList
            data={incidents}
            style={styles.incidentsList}
            keyExtractor={incident => String(incident.id)}
            showsVerticalScrollIndicator={false}
            //chama uma função quando chega perto do fim da lista
            onEndReached={loadingIncidents}
            //define a quantos por cento de distância do fim da lista deve-se carregar mais itens
            onEndReachedThreshold={0.2}
            //trocamos o nome da variavel item (padrão) por incident para evitar confusões
            renderItem={({ item: incident }) => (
              <View style={styles.incident}>
                <Text style={styles.incidentProperty}>ONG:</Text>
                <Text style={styles.incidentValue}>{incident.name}</Text>

                <Text style={styles.incidentProperty}>CASO:</Text>
                <Text style={styles.incidentValue}>{incident.title}</Text>

                <Text style={styles.incidentProperty}>VALOR:</Text>
                <Text style={styles.incidentValue}>
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency', currency: 'BRL'
                  }).format(incident.value)}
                </Text>

                <TouchableOpacity
                  style={styles.detailsButton}
                  //se colocasse direto sem a arrow function, a função seria executada assim que carregasse a tela
                  onPress={() => navigateToDetail(incident)}
                >
                  <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                  <Feather name="arrow-right" size={16} color="#E02041" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
    </View>
  )
}
