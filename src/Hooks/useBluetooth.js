import { useState, useEffect } from 'react';

const useBluetooth = () => {
  const [bleDevice, setBleDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [service, setService] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [bleStatus, setBleStatus] = useState('');

  const connectBluetooth = async (cat_num) => {
    try {
        setBleStatus('Requesting Bluetooth device...');
        const connectDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: cat_num }],
            optionalServices: [process.env.REACT_APP_BLE_SERVICE_UUID]
        });

        connectDevice.addEventListener('gattserverdisconnected', onDisconnected);

        setBleStatus('Connecting to Bluetooth device...');
        const server = await connectDevice.gatt.connect();
        setBleStatus('Getting primary service...');
        const service = await server.getPrimaryService(process.env.REACT_APP_BLE_SERVICE_UUID);
        setBleStatus('Getting characteristic...');
        const characteristic = await service.getCharacteristic(process.env.REACT_APP_BLE_CHARACTERISTIC_UUID);

        setBleDevice(connectDevice);
        setServer(server);
        setService(service);
        setCharacteristic(characteristic);
        setBleStatus('Connected to Bluetooth device');
    } catch (error) {
      throw new Error(error.message || 'Failed to connect to Bluetooth device');
    }
  };

  const onDisconnected = () => {
    setBleStatus('Bluetooth device disconnected');
    cleanUpConnection();
  };

  const cleanUpConnection = () => {
    setServer(null);
    setService(null);
    setCharacteristic(null);
    setBleDevice(null);
  };

  const sendCredentials = async (wifi_ssid, wifi_password) => {
    try {
      if (!characteristic) throw new Error('No characteristic found');

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(`SSID:${wifi_ssid}\n`));
      await characteristic.writeValue(encoder.encode(`PASS:${wifi_password}\n`));
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
      throw new Error('Error sending WiFi credentials');
    }
  };

  useEffect(() => {
    return () => {
      if (bleDevice) {
        bleDevice.removeEventListener('gattserverdisconnected', onDisconnected);
      }
      cleanUpConnection();
    };
  }, [bleDevice]);

  return { connectBluetooth, sendCredentials, bleStatus, bleDevice, server, service };
};

export default useBluetooth;
