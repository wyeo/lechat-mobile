# Le Chat by Mistral AI

The app demonstrates real-time chat interactions powered by Mistral AI.

[Watch Demo Video](https://youtube.com/shorts/88aDHMg_F6U)

## Features
- Real-time chat interface with stream-based responses
- Powered by Mistral AI Large model
- Cross-platform (iOS & Android) support
- Dark mode theme
- Multi-language support (English, French)

## Downloads
- [Android APK](https://expo.dev/artifacts/eas/xrZesc1H8zU7JbTgqfCH7b.aab)
- [iOS Build](https://expo.dev/artifacts/eas/tHSAt6ZTGv52FGxHMY4nFZ.ipa)

## Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Mistral API key

### Backend Setup
The backend is a simple Vercel Edge Function that integrates with Mistral AI:

```typescript
import { streamText } from "ai";
import { mistral } from "@ai-sdk/mistral";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();
    const result = streamText({
      model: mistral("mistral-large-latest", { safePrompt: true }),
      messages,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

1. Clone the backend repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your [Mistral API key](https://console.mistral.ai/api-keys/):
```bash
MISTRAL_API_KEY=your_api_key_here  # Get it from https://console.mistral.ai/api-keys/
```

For more information about the Mistral AI integration, check the [Vercel AI SDK documentation](https://sdk.vercel.ai/providers/ai-sdk-providers/mistral#mistral-ai-provider).

4. Deploy to Vercel or run locally:
```bash
vercel dev
```

### Mobile App Setup
1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app
```

4. Start the development server:
```bash
npx expo start
```

## Architecture
The application uses a simple client-server architecture:
- Frontend: React Native with Expo
- Backend: Vercel Edge Functions with Mistral AI integration

## Roadmap
- End-to-end testing with Maestro
- Enhanced accessibility features
- Error tracking (Sentry/Firebase Crashlytics)
- Analytics implementation

## License
MIT License
