import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function JugarScreen() {
    const ajusteBarca = 10;
    const ajusteChampions = -7;
  const [position, setPosition] = useState({ x: 180, y: 650, vy: -5 });
  const [subscription, setSubscription] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bases, setBases] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i + '-' + Math.random(),
      x: Math.random() * 280,
      y: 700 - i * 100, 
      touched: false,
    }))
  );
  const [win, setWin] = useState(false);
  const [special, setSpecial] = useState(false);

  useEffect(() => {
    let gyroSub: any = null;
    if (!gameOver && !win) {
      gyroSub = Gyroscope.addListener((gyroscopeData: any) => {
        setPosition(pos => ({
          ...pos,
          x: Math.max(0, Math.min(360, pos.x + gyroscopeData.y * 10)),
        }));
      });
      Gyroscope.setUpdateInterval(50);
    }
    return () => {
      if (gyroSub) gyroSub.remove();
    };
  }, [gameOver, win]);

  useEffect(() => {
  if (gameOver || win) return;
    const interval = setInterval(() => {
      setPosition(pos => {
        let newY = pos.y + pos.vy;
        let newVy = pos.vy + 1.2; 
        let newBases = bases.map(base => ({ ...base }));
        let scored = false;
        for (let i = 0; i < newBases.length; i++) {
          const base = newBases[i];
          const barcaLeft = pos.x;
          const barcaRight = pos.x + 40;
          const barcaTop = newY + ajusteBarca;
          const barcaBottom = newY + 40 + ajusteBarca;
          const baseLeft = base.x;
          const baseRight = base.x + 60;
          const baseTop = base.y + ajusteChampions;
          const baseBottom = base.y + 40 + ajusteChampions;
          const colisionHorizontal = barcaRight > baseLeft && barcaLeft < baseRight;
          const colisionVertical = barcaBottom >= baseTop && barcaBottom <= baseTop + 25;
          if (
            colisionHorizontal && colisionVertical &&
            newVy > 0 &&
            !base.touched &&
            newY < 650
          ) {
              newVy = -17; // salto 
            newY = base.y - 40; 
            newBases[i].touched = true;
            scored = true;
          }
        }
        if (scored) {
          setScore(s => s + 1);
          setBases(bs => [
            ...bs,
            {
              id: Math.random().toString(),
              x: Math.random() * 280,
              y: Math.min(...bs.map(b => b.y)) - 180,
              touched: false,
            },
          ]);
        }
        setBases(bs =>
          bs.map(b => ({ ...b, y: b.y + (scored ? 160 : 0) }))
            .filter(b => b.y < 800)
        );
        if (score + (scored ? 1 : 0) >= 20) {
          setWin(true);
          return { ...pos, vy: 0 };
        }
        if (newY >= 700) {
          setGameOver(true);
        }
        if (score + (scored ? 1 : 0) === 2) {
          setSpecial(true);
        }
        newY = Math.max(0, Math.min(700, newY));
        return { ...pos, y: newY, vy: newVy };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameOver, win, bases, score]);

  return (
  <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
    <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 22, fontWeight: 'bold' }}>
      Champions: {score}
    </Text>
    {bases.map((base, i) => (
      <View
        key={base.id}
        style={{
          position: 'absolute',
          left: base.x,
          top: base.y,
          width: 60,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: base.touched ? 0.5 : 1,
        }}
      >
        <Image
          source={require('../../assets/images/champions.png')}
          style={{ width: 60, height: 40, resizeMode: 'contain' }}
        />
      </View>
    ))}
    <View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../assets/images/barcelona.png')}
        style={{ width: 40, height: 40 }}
      />
    </View>
      {gameOver && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}>
          <Text style={{ fontSize: 22, color: 'white', marginBottom: 20, fontWeight: 'bold' }}>
            ¡Perdiste!
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#6C63FF', padding: 18, borderRadius: 30 }}
            onPress={() => {
              setScore(0);
              setPosition({ x: 180, y: 650, vy: -5 });
              setGameOver(false);
              setWin(false);
              setSpecial(false);
              setBases(
                Array.from({ length: 5 }, (_, i) => ({
                  id: i + '-' + Math.random(),
                  x: Math.random() * 280,
                  y: 700 - i * 180,
                  touched: false,
                }))
              );
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
    {win && (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <Text style={{ fontSize: 32, color: 'white', marginTop: 60, marginBottom: 30, fontWeight: 'bold', textAlign: 'center' }}>
          ¡Ganaste!
        </Text>
        <Text style={{ fontSize: 24, color: 'gold', marginBottom: 40, fontWeight: 'bold', textAlign: 'center' }}>
          El Barcelona es el mejor equipo de la historia
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#6C63FF', padding: 18, borderRadius: 30, marginBottom: 20 }}
          onPress={() => {
            setScore(0);
            setPosition({ x: 180, y: 650, vy: -5 });
            setGameOver(false);
            setWin(false);
            setSpecial(false);
            setBases(
              Array.from({ length: 5 }, (_, i) => ({
                id: i + '-' + Math.random(),
                x: Math.random() * 280,
                y: 700 - i * 180,
                touched: false,
              }))
            );
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Volver a jugar</Text>
        </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#222', padding: 14, borderRadius: 30, marginBottom: 10 }}
            onPress={() => {
              router.replace('/tabs');
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Volver al inicio</Text>
          </TouchableOpacity>
      </View>
    )}
  </View>
);
}