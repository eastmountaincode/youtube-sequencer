import { audioEngine } from './audioEngine';

declare global {
  interface Window {
      onYouTubeIframeAPIReady: () => void;
      YT: any;
  }
}

// Initialize core services
export const initializeServices = (): Promise<{ audioEngine: typeof audioEngine }> => {
  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
      resolve({ audioEngine });
    };
  });
};
