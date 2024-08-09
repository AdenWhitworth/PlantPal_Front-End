import { useState, useEffect } from 'react';

const useBluetooth = () => {
  const [bleDevice, setBleDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [service, setService] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [bleStatus, setBleStatus] = useState('');

  const connectBluetooth = async () => {
    try {
        setBleStatus('Requesting Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'ESP32_BLE' }],
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
        });

        setBleStatus('Connecting to Bluetooth device...');
        const server = await device.gatt.connect();
        setBleStatus('Getting primary service...');
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        setBleStatus('Getting characteristic...');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        setBleDevice(bleDevice);
        setServer(server);
        setService(service);
        setCharacteristic(characteristic);
        setBleStatus('Connected to Bluetooth device');
    } catch (error) {
        console.error('Error connecting to Bluetooth device:', error);
        setBleStatus('Failed to connect to Bluetooth device');
    }
  };

  const sendCredentials = async (ssid, password) => {
    try {
      if (!characteristic) throw new Error('No characteristic found');

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(`SSID:${ssid}\n`));
      await characteristic.writeValue(encoder.encode(`PASS:${password}\n`));
      setBleStatus('Credentials sent, waiting for response...');

      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const decoder = new TextDecoder();
        const value = decoder.decode(event.target.value);
        setBleStatus(value);
      });
      await characteristic.startNotifications();
    } catch (error) {
      console.error('Error sending WiFi credentials:', error);
      setBleStatus('Failed to send WiFi credentials');
    }
  };

  return { connectBluetooth, sendCredentials, bleStatus, bleDevice, server, service };
};

export default useBluetooth;
