// import {useActiveProgress, useActiveTrackEpisode} from '@store/selectors/podcasts.selectors';
import {useCallback, useState} from 'react';
import TrackPlayer, {AndroidAudioContentType, IOSCategoryMode} from 'react-native-track-player';

export const useSetupTrackPlayer = () => {
  //   const activeEpisode = useActiveTrackEpisode();
  //   const activeProgress = useActiveProgress();
  const [isSetup, setIsSetup] = useState(false);

  const setupPlayer = useCallback(async () => {
    if (!isSetup) {
      await TrackPlayer.setupPlayer({
        iosCategoryMode: IOSCategoryMode.SpokenAudio,
        androidAudioContentType: AndroidAudioContentType.Speech,
      }).catch(error => console.log(error));

      setIsSetup(true);
    }
    // if (activeEpisode?.filePath && activeProgress?.position) {
    //   try {
    //     await TrackPlayer.seekTo(activeProgress?.position);
    //     return true;
    //   } catch (e) {
    //     catchError(e);
    //     return false;
    //   }
    // }
  }, [isSetup]);
  return [isSetup, setupPlayer] as const;
};
