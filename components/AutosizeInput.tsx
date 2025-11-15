import React, { useLayoutEffect, useRef, useEffect } from 'react';

// A single measurement span, attached to the body, to be reused across all component instances.
// This is more efficient than creating/destroying a span for each input.
let measurementSpan: HTMLSpanElement | null = null;
const getMeasurementSpan = (sourceElement: HTMLElement): HTMLSpanElement => {
    if (!measurementSpan) {
        measurementSpan = document.createElement('span');
        // The span should be hidden and not affect layout.
        Object.assign(measurementSpan.style, {
            visibility: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap',
            left: '-9999px',
        });
        document.body.appendChild(measurementSpan);
    }
    // Ensure the span has the same font styles as the textarea for accurate measurement.
    const computedStyle = window.getComputedStyle(sourceElement);
    Object.assign(measurementSpan.style, {
        font: computedStyle.font,
        letterSpacing: computedStyle.letterSpacing,
    });
    return measurementSpan;
};

const AutosizeInput: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ value, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustStyles = () => {
    const textarea = textareaRef.current;
    // Don't run if the element isn't in the DOM or visible.
    if (!textarea || !textarea.offsetParent) return;

    const span = getMeasurementSpan(textarea);
    span.textContent = value as string;

    const isSmallScreen = window.innerWidth < 640;
    const baseFontSize = isSmallScreen ? 14 : 16;
    const minFontSize = 10;
    
    const computedStyle = window.getComputedStyle(textarea);
    // Calculate the available width inside the textarea, accounting for padding.
    const availableWidth = textarea.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);

    let newFontSize = baseFontSize;
    span.style.fontSize = `${newFontSize}px`;

    // 1. Iteratively shrink the font size until the text fits or min size is reached.
    // We use getBoundingClientRect().width for sub-pixel accuracy.
    while (span.getBoundingClientRect().width > availableWidth && newFontSize > minFontSize) {
        newFontSize--;
        span.style.fontSize = `${newFontSize}px`;
    }

    // Apply the calculated font size.
    textarea.style.fontSize = `${newFontSize}px`;

    // 2. If the text still overflows after shrinking to the minimum size, allow it to wrap.
    // This is the only condition under which text should wrap.
    if (newFontSize <= minFontSize && span.getBoundingClientRect().width > availableWidth) {
        textarea.style.whiteSpace = 'normal';
    } else {
        textarea.style.whiteSpace = 'nowrap';
    }
  };

  // useLayoutEffect runs synchronously after DOM mutations, perfect for measurements.
  useLayoutEffect(() => {
    adjustStyles();
  }, [value]);

  // Add a resize listener to readjust on window resize.
  useEffect(() => {
    const handleResize = () => adjustStyles();
    // A slight delay on mount can help if table layout is settling.
    const timeoutId = setTimeout(adjustStyles, 50); 
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    // This wrapper div uses Flexbox to vertically center the textarea content.
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        {...props}
        className="" // Let the global styles apply.
        style={{
            // Resetting some styles that might conflict with the flex wrapper
            // while allowing others from the stylesheet.
            height: 'auto', // Allow height to be intrinsic for centering to work
            maxHeight: '100%', // But don't let it overflow the cell
            whiteSpace: 'nowrap', // Start with nowrap, JS will control wrapping
        }}
      />
    </div>
  );
};

export default AutosizeInput;
