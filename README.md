# AndVPN Mobile App

A robust React Native Expo mobile application for AndVPN - Advanced WireGuard Management System.

## 🚀 Features

- **Cross-Platform**: iOS and Android support with single codebase
- **Secure Authentication**: Integration with Clerk authentication
- **QR Code Setup**: Easy device configuration via QR codes
- **Multi-Protocol Support**: WireGuard and OpenVPN protocols
- **Real-time Monitoring**: Live connection status and data usage
- **Device Management**: Create, configure, and manage VPN devices
- **Role-based Access**: User, Admin, and Super Admin permissions
- **Modern UI**: Beautiful, responsive design with NativeWind/TailwindCSS

## 📋 Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Clerk account for authentication

## 🛠️ Installation

### 1. Copy Files from Web Project

Copy the files from the `mobile-app-files` directory in the web project to your mobile app:

```bash
# From your mobile app directory
cp -r ../andvpn/mobile-app-files/* .
cp ../andvpn/mobile-app-files/.env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Edit the `.env` file with your configuration:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-andvpn-backend.com/api
EXPO_PUBLIC_WEB_URL=https://your-andvpn-web.com

# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# VPN Server Configuration
EXPO_PUBLIC_WIREGUARD_SERVER_IP=your_server_ip
EXPO_PUBLIC_WIREGUARD_SERVER_PORT=51820
EXPO_PUBLIC_WIREGUARD_SERVER_PUBLIC_KEY=your_server_public_key
EXPO_PUBLIC_WIREGUARD_SERVER_ENDPOINT=your_domain:51820
```

### 4. Start Development Server

```bash
npm start
```

## 📱 Running the App

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web (for testing)

```bash
npm run web
```

## 🏗️ Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── vpn/              # VPN-specific components
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API communication
│   ├── permissions.ts    # Role-based access control
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── constants/            # App constants
└── assets/               # Images, icons, fonts
```

## 🎯 Key Features Implementation

### Authentication Flow

- Clerk integration for secure user management
- Role-based access control (User/Admin/Super Admin)
- Persistent login state

### VPN Device Management

- Create new VPN configurations
- QR code generation and scanning
- Multi-protocol support (WireGuard/OpenVPN)
- Real-time connection monitoring

### UI/UX Design

- Modern, intuitive interface
- Dark/light theme support
- Responsive design for all screen sizes
- Smooth animations and transitions

## 🔧 Development Guidelines

### Component Structure

Follow the DRY principle and create reusable components:

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
};
```

### API Integration

Use the centralized API client:

```typescript
import { apiClient } from "@/lib/api-client";

const devices = await apiClient.getDevices();
```

### State Management

Utilize React Query for server state:

```typescript
import { useQuery } from "@tanstack/react-query";

const { data: devices, isLoading } = useQuery({
  queryKey: ["devices"],
  queryFn: () => apiClient.getDevices(),
});
```

## 🚢 Building for Production

### Android

```bash
npm run build:android
```

### iOS

```bash
npm run build:ios
```

## 🧪 Testing

```bash
npm run lint
npm run type-check
```

## 📄 Environment Variables Reference

| Variable                            | Description      | Example                  |
| ----------------------------------- | ---------------- | ------------------------ |
| `EXPO_PUBLIC_API_URL`               | Backend API URL  | `https://api.andvpn.com` |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...`            |
| `EXPO_PUBLIC_WIREGUARD_SERVER_IP`   | VPN server IP    | `31.97.41.230`           |
| `EXPO_PUBLIC_WIREGUARD_SERVER_PORT` | VPN server port  | `51820`                  |

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Clerk React Native](https://clerk.com/docs/references/react-native)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test on both iOS and Android
4. Update documentation as needed

## 📞 Support

For technical support or questions:

- Email: support@andgroupco.com
- Documentation: Check the web project's documentation
- Issues: Create an issue in the repository
