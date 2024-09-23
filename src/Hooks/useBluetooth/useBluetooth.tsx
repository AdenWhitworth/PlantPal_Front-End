import { useState, useEffect, useCallback } from 'react';
import { BluetoothDeviceExtended, BluetoothCharacteristicExtended } from './useBluetoothTypes';

/**
 * Custom hook to manage Bluetooth connections, including device discovery, GATT server connection,
 * characteristic interaction, and handling disconnections.
 * 
 * @returns {Object} Contains methods for connecting to a Bluetooth device, sending credentials,
 * triggering disconnection, and maintaining Bluetooth connection status.
 */
const useBluetooth = () => {
  const [bleDevice, setBleDevice] = useState<BluetoothDeviceExtended | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [service, setService] = useState<BluetoothRemoteGATTService | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothCharacteristicExtended | null>(null);
  const [bleStatus, setBleStatus] = useState<string>('');

  /**
   * Initiates connection to a Bluetooth device and retrieves its GATT server, service, and characteristic.
   * 
   * @function
   * @param {string} cat_num - The Bluetooth device's name used for filtering during the connection request.
   * @throws {Error} Throws an error if the connection fails or GATT server is unavailable.
   */
  const connectBluetooth = async (cat_num: string) => {
    try {
        setBleStatus('Requesting Bluetooth device...');
        const connectDevice: BluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: cat_num }],
            optionalServices: [process.env.REACT_APP_BLE_SERVICE_UUID as string]
        });

        if (!connectDevice.gatt) {
          throw new Error('GATT server is not available on this device');
        }

        connectDevice.addEventListener('gattserverdisconnected', onDisconnected);

        setBleStatus('Connecting to Bluetooth device...');
        const server = await connectDevice.gatt.connect();
        setBleStatus('Getting primary service...');
        const service = await server.getPrimaryService(process.env.REACT_APP_BLE_SERVICE_UUID as string);
        setBleStatus('Getting characteristic...');
        const characteristic = await service.getCharacteristic(process.env.REACT_APP_BLE_CHARACTERISTIC_UUID as string);

        setBleDevice(connectDevice as BluetoothDeviceExtended);
        setServer(server);
        setService(service);
        setCharacteristic(characteristic);
        console.log(characteristic);
        setBleStatus('Connected to Bluetooth device');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      if (error instanceof Error && error.hasOwnProperty('message')) {
        const axiosError = error as any;

        errorMessage = axiosError.message || 'Failed to connect to Bluetooth device';
      }
      throw new Error(errorMessage);
    }
  };

  /**
   * Callback function to handle disconnection events from the Bluetooth device.
   * 
   * @function
   */
  const onDisconnected = useCallback(() => {
    setBleStatus('Bluetooth device disconnected');
    cleanUpConnection();
  }, []);

  /**
   * Cleans up the Bluetooth connection by resetting the server, service, characteristic, and device state.
   * 
   * @function
   */
  const cleanUpConnection = () => {
    setServer(null);
    setService(null);
    setCharacteristic(null);
    setBleDevice(null);
  };

  /**
   * Sends Wi-Fi credentials to the connected Bluetooth device using the characteristic.
   * 
   * @function
   * @param {string} wifi_ssid - The Wi-Fi SSID to send.
   * @param {string} wifi_password - The Wi-Fi password to send.
   * @throws {Error} Throws an error if the characteristic is not available or if the credentials cannot be sent.
   */
  const sendCredentials = async (wifi_ssid: string, wifi_password: string) => {
    try {
      console.log(characteristic);
      if (!characteristic) throw new Error('No characteristic found');

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(`SSID:${wifi_ssid}\n`));
      await characteristic.writeValue(encoder.encode(`PASS:${wifi_password}\n`));
      setBleStatus('Credentials sent, waiting for response...');

      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const decoder = new TextDecoder();
        const value = decoder.decode(target.value!);
        setBleStatus(value);
      });
      await characteristic.startNotifications();
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      if (error instanceof Error) {
        errorMessage = 'Error sending WiFi credentials over ble';
      }
      
      setBleStatus(errorMessage);
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Manually triggers a disconnection event for the Bluetooth device testing.
   * 
   * @function
   */
  const triggerDisconnection = () => {
    if (bleDevice) {
      bleDevice.dispatchEvent(new Event('gattserverdisconnected'));
    }
  };

  /**
   * Effect to clean up the connection and remove event listeners when the component unmounts or the device disconnects.
   */
  useEffect(() => {
    return () => {
      if (bleDevice) {
        bleDevice.removeEventListener('gattserverdisconnected', onDisconnected);
      }
      cleanUpConnection();
    };
  }, [bleDevice, onDisconnected]);

  return { connectBluetooth, sendCredentials, triggerDisconnection, onDisconnected, bleStatus, bleDevice, server, service };
};

export default useBluetooth;
