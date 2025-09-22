import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#6C63FF',
          padding: 20,
          borderRadius: 100,
          marginBottom: 20,
        }}
        onPress={() => router.push('/tabs/jugar')}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Jugar</Text>
      </TouchableOpacity>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 26,
          fontWeight: 'bold',
          color: '#222',
          marginHorizontal: 20,
          marginTop: 10,
        }}
      >
        Ayuda al Barcelona a ganar más Champions que los chorros del Real Madrid
        {'\n'}
        Alias: Asociación de robos y deportivo penales
      </Text>
    </View>
  );
}