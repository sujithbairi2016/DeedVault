import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deedvault.app',
  appName: 'DeedVault',
  webDir: 'dist',
  server: {
    url: 'http://192.168.0.126:3001', // Change localhost to your IP
    cleartext: true
  }
};

export default config;
