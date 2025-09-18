
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDE68A', dark: '#1E293B' }}
      headerImage={
        <View style={styles.headerImageWrap}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.reactLogo}
          />
        </View>
      }
    >
      <ThemedView style={styles.centered}>
        <ThemedText type="title" style={styles.gradientText}>
          ¡Bienvenido a tu App Web!
        </ThemedText>
        <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
          🚀 Expo + React Native + Web
        </ThemedText>
        <ThemedText style={styles.description}>
          Edita este archivo para personalizar tu pantalla principal.<br />
          Prueba el hot reload: guarda y mira los cambios al instante.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">¿Listo para crear?</ThemedText>
        <ThemedText>
          Explora la pestaña <ThemedText type="defaultSemiBold">Explore</ThemedText> para ver ejemplos y tips.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">¿No ves la app en el móvil?</ThemedText>
        <ThemedText>
          Asegúrate que tu PC y tu celular estén en la misma red WiFi.<br />
          Si compartes internet desde el celular, prueba abrir la app web en el navegador.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  reactLogo: {
    height: 120,
    width: 120,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  centered: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gradientText: {
    color: '#F59E42', // Color naranja llamativo
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
