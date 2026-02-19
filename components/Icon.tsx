
import React from 'react';

interface IconProps {
  name: 'upload' | 'print' | 'save' | 'refresh' | 'sparkles' | 'minus' | 'plus' | 'crop' | 'info';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />,
    print: <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.821V7.5a.75.75 0 0 1 .22-.53l3.47-3.47a.75.75 0 0 1 .53-.22h7.31a.75.75 0 0 1 .75.75V13.821M17.25 19.25H12V14.25H17.25M17.25 19.25H21V11.25H17.25M12 19.25H3V11.25H12M12 11.25V9.75" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />,
    minus: <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />,
    crop: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3.75 3.75 10.5M20.25 13.5v6.75a.75.75 0 0 1-.75.75h-6.75M16.5 3.75h3a.75.75 0 0 1 .75.75v3M3.75 16.5v3a.75.75 0 0 0 .75.75h3" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      {icons[name]}
    </svg>
  );
};
