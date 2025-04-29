import React from 'react';
import { View, Text, StyleSheet, Platform, Button } from 'react-native'; // Added Button
import { colors } from '@/constants/Colors'; // Import colors

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const IFRAME_ID = 'rork-web-preview'; // Replace if needed

const webTargetOrigins = [
  "http://localhost:3000", // Add your local dev origin if different
  "https://rorkai.com", // Add Rork production origins
  "https://rork.app",
  // Add any other origins where the iframe might be hosted
];

function sendErrorToIframeParent(error: any, errorInfo?: any) {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.parent !== window) {
    console.debug('Sending error to parent:', {
      error,
      errorInfo,
      referrer: document.referrer
    });

    const errorMessage = {
      type: 'APP_ERROR', // Use a specific type for app errors
      error: {
        message: error?.message || error?.toString() || 'Unknown error',
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
      },
      iframeId: IFRAME_ID, // Include ID if needed by parent
    };

    // Determine the target origin dynamically based on referrer if possible
    let targetOrigin = '*'; // Default to wildcard
     if (document.referrer) {
         try {
             const referrerOrigin = new URL(document.referrer).origin;
             if (webTargetOrigins.includes(referrerOrigin)) {
                 targetOrigin = referrerOrigin;
             }
         } catch (e) {
             console.warn("Could not parse referrer origin:", e);
         }
     }


    try {
      window.parent.postMessage(errorMessage, targetOrigin);
    } catch (postMessageError) {
      console.error('Failed to send error to parent:', postMessageError);
    }
  } else if (Platform.OS !== 'web') {
     // Log errors for native platforms differently if needed
     console.error("Caught Error:", error, errorInfo);
  }
}

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Prevent default console error for uncaught errors
    event.preventDefault();
    const errorDetails = event.error ?? {
      message: event.message ?? 'Uncaught error',
      filename: event.filename ?? 'Unknown file',
      lineno: event.lineno ?? 'Unknown line',
      colno: event.colno ?? 'Unknown column'
    };
    sendErrorToIframeParent(errorDetails);
  }, true); // Use capture phase

  window.addEventListener('unhandledrejection', (event) => {
    // Prevent default console error for unhandled promise rejections
    event.preventDefault();
    sendErrorToIframeParent(event.reason ?? 'Unhandled promise rejection');
  }, true); // Use capture phase

  // Optional: Override console.error to send messages
  // Be cautious with this, it might send too many messages
  /*
  const originalConsoleError = console.error;
  console.error = (...args) => {
    sendErrorToIframeParent(args.map(arg => String(arg)).join(' '));
    originalConsoleError.apply(console, args);
  };
  */
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Send error to parent iframe or log it
    sendErrorToIframeParent(error, errorInfo);

    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

   // Function to attempt recovery (e.g., by resetting state)
   // This is a basic example; real recovery might be more complex
   handleRetry = () => {
     this.setState({ hasError: false, error: null });
     // You might need to trigger a reload or state reset in your app logic here
   };


  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong.</Text>
            <Text style={styles.subtitle}>We encountered an unexpected error.</Text>
            {this.state.error && (
              <Text style={styles.errorDetails} selectable>
                 {/* Only show error details in development */}
                 {__DEV__ ? this.state.error.toString() : 'Please try again.'}
              </Text>
            )}
            {Platform.OS !== 'web' && !__DEV__ && (
              <Text style={styles.description}>
                Please restart the application. If the problem persists, contact support.
              </Text>
            )}
             {__DEV__ && ( // Show retry button only in development
               <Button title="Try Again" onPress={this.handleRetry} color={colors.primary}/>
             )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Use theme background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24, // Adjust size
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12, // Adjust spacing
    color: colors.error, // Use error color for title
  },
  subtitle: {
    fontSize: 16, // Adjust size
    color: colors.gray[700], // Use theme color
    marginBottom: 12,
    textAlign: 'center',
  },
   errorDetails: {
     fontSize: 14,
     color: colors.gray[600],
     textAlign: 'center',
     marginBottom: 20,
     paddingHorizontal: 10,
     fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', // Monospace font for errors
   },
  description: {
    fontSize: 14,
    color: colors.gray[600], // Use theme color
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ErrorBoundary;