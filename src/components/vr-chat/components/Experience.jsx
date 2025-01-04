'use client';

import { useChat } from '@/hooks/useChat';
import { CameraControls, ContactShadows, Environment, Text } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Avatar } from './Avatar';

const Dots = (props) => {
  const { loading } = useChat();

  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return '.';
          }
          return loadingText + '.';
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText('');
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={'left'} anchorY={'bottom'}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  console.log('cameraControls', cameraControls.current);

  useEffect(() => {
    cameraControls.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  return (
    <>
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <CameraControls ref={cameraControls} />
        <Environment files="/venice_sunset_1k.hdr" background />
        <Dots position-y={1.75} position-x={-0.02} />
        <Avatar />
        <ContactShadows opacity={0.7} />
      </Suspense>
    </>
  );
};