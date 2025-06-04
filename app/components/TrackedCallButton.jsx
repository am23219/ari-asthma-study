'use client';

import { useFacebookTracking } from '../hooks/useFacebookTracking';

/**
 * A wrapper component for call buttons that automatically tracks clicks
 */
export default function TrackedCallButton({ 
  children, 
  phoneNumber = "3526677237",
  location = "unknown",
  className = "",
  customData = {},
  ...props 
}) {
  const { trackCallButtonClick, trackPhoneInteraction } = useFacebookTracking();

  const handleClick = async (e) => {
    // Track the call button click
    await trackCallButtonClick({
      location,
      customData: {
        button_text: typeof children === 'string' ? children : 'Call Button',
        ...customData
      }
    });

    // Track phone interaction
    await trackPhoneInteraction(phoneNumber, {
      location,
      customData
    });

    // Call any existing onClick handler
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <a 
      href={`tel:${phoneNumber}`}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Higher-order component to add tracking to existing call buttons
 */
export function withCallTracking(WrappedComponent) {
  return function TrackedCallComponent(props) {
    const { trackCallButtonClick, trackPhoneInteraction } = useFacebookTracking();

    const handleCallClick = async (location = props.location || 'unknown') => {
      await trackCallButtonClick({
        location,
        customData: props.customData || {}
      });

      if (props.href && props.href.startsWith('tel:')) {
        const phoneNumber = props.href.replace('tel:', '');
        await trackPhoneInteraction(phoneNumber, {
          location,
          customData: props.customData || {}
        });
      }
    };

    const enhancedProps = {
      ...props,
      onClick: async (e) => {
        await handleCallClick();
        if (props.onClick) {
          props.onClick(e);
        }
      }
    };

    return <WrappedComponent {...enhancedProps} />;
  };
} 