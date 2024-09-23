/**
 * Extends the standard `BluetoothDevice` interface to include the `gatt` property.
 * 
 * @interface BluetoothDeviceExtended
 * @extends {BluetoothDevice}
 * 
 * @property {BluetoothRemoteGATTServer} gatt - The GATT server for the device, allowing interaction with Bluetooth services and characteristics.
 */
export interface BluetoothDeviceExtended extends BluetoothDevice {
    gatt: BluetoothRemoteGATTServer;
}
  
/**
 * Extends the standard `BluetoothRemoteGATTCharacteristic` interface without adding additional properties or methods.
 * 
 * @interface BluetoothCharacteristicExtended
 * @extends {BluetoothRemoteGATTCharacteristic}
 */
export interface BluetoothCharacteristicExtended extends BluetoothRemoteGATTCharacteristic {}
