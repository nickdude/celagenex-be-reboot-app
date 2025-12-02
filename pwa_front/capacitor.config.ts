import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.breboot.frontend',
  appName: 'BreBoot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Add any plugin configurations here if needed
  }
};

export default config; 