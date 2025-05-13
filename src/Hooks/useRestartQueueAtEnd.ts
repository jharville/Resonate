import {useEffect} from 'react';
import TrackPlayer, {Event} from 'react-native-track-player';

// Restarts the queue when the last song ends but doesn't play it (like spotify)
export const useRestartQueueAtEnd = () => {
  useEffect(() => {
    const listener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) {
        await TrackPlayer.skip(0);
        await TrackPlayer.pause();
      }
    });

    return () => listener.remove();
  }, []);
};
