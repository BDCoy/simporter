import React from 'react';

interface ReactElementWithChildren extends React.ReactElement {
  props: {
    children?: React.ReactNode;
  };
}

export const extractTextFromJSX = (element: React.ReactNode): string => {
  if (typeof element === 'string') {
    return element;
  }

  if (Array.isArray(element)) {
    return element.map(child => extractTextFromJSX(child)).join(' ');
  }

  if (React.isValidElement(element)) {
    const elementWithChildren = element as ReactElementWithChildren;
    if (elementWithChildren.props.children) {
      return extractTextFromJSX(elementWithChildren.props.children);
    }
  }

  return '';
};