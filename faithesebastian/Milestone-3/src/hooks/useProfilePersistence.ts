import { useEffect } from 'react'
import {
  profileStorage,
  setProfileStorageError,
} from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

export function useProfilePersistence() {
  const dispatch = useAppDispatch()
  const { displayName, email, profileImage, profileStorageError } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (profileStorageError) return
    try {
      window.localStorage.setItem(profileStorage, JSON.stringify({ displayName, email, profileImage }))
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
      dispatch(setProfileStorageError(`Could not save profile changes. ${detail}`))
    }
  }, [dispatch, displayName, email, profileImage, profileStorageError])
}
