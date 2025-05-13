import {useEffect} from 'react';
import TrackPlayer, {Event} from 'react-native-track-player';
import {useDispatch} from 'react-redux';
import {setActiveTrack} from '../redux/playerSlice';

// Keeps Redux in sync with TrackPlayer, so the activeTrack that is displayed in
// AudioPlayer and AudioPlayerModal is always up to date

export const useSyncActiveTrack = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
      const track = await TrackPlayer.getActiveTrack();
      if (track) dispatch(setActiveTrack(track));
    });

    return () => listener.remove();
  }, [dispatch]);
};
