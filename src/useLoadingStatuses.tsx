import {useState} from 'react';

export const loadingStatuses = {
  IDLE: 'idle',
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error',
  NO_DATA: 'no_data',
};

export type LoadingStatus = (typeof loadingStatuses)[keyof typeof loadingStatuses];

export const useLoadingStatus = () => {
  const [status, setStatus] = useState<LoadingStatus>(loadingStatuses.IDLE);

  const startLoading = () => setStatus(loadingStatuses.LOADING);
  const setDoneLoading = () => setStatus(loadingStatuses.DONE);
  const setError = () => setStatus(loadingStatuses.ERROR);
  const setNoData = () => setStatus(loadingStatuses.NO_DATA);
  const resetStatus = () => setStatus(loadingStatuses.IDLE);

  return {
    status,
    startLoading,
    setDoneLoading,
    setError,
    setNoData,
    resetStatus,
  };
};
