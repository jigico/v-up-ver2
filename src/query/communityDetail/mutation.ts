import { queryClient } from '@/app/provider'
import { useMutation } from '@tanstack/react-query'
import {
  addCommnityBoard,
  deleteCommunityBoard,
  updateCommnityBoard,
} from '@/shared/communitydetail/detailApi'
import { insertCurrentMusic, updateCurrentMusic } from '@/shared/main/api'
import { insertMyPlayMusic, updateMyPlayMusic } from '@/shared/musicPlayer/api'
import { GET_COMMUNITY_DETAIL_QUERY_KEYS } from './queryKey'
import { GET_MUSIC_LIST_QUERY_KEYS } from '../musicPlayer/musicPlayerQueryKeys'

export const validateFormBlank = (firstInput: string, secondInput: string) => {
  const blankPattern = /^\s+|\s+$/g
  const firstBlank = (firstInput || '').replace(blankPattern, '')
  const secondBlank = (secondInput || '').replace(blankPattern, '')

  return { firstBlank, secondBlank }
}

export const useCoummunityItem = () => {
  const updateCommunityMutation = useMutation({
    mutationFn: updateCommnityBoard,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [GET_COMMUNITY_DETAIL_QUERY_KEYS.COMMUNITY_DETAIL],
      }),
  })

  const deleteCommunityMutation = useMutation({
    mutationFn: deleteCommunityBoard,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [GET_COMMUNITY_DETAIL_QUERY_KEYS.COMMUNITY_DETAIL],
      }),
  })

  const addCommunityMutation = useMutation({
    mutationFn: addCommnityBoard,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [GET_COMMUNITY_DETAIL_QUERY_KEYS.COMMUNITY_DETAIL],
      }),
  })
  const insertMyMutation = useMutation({
    mutationFn: insertMyPlayMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_LIST],
      })
    },
  })

  const updateMyMutation = useMutation({
    mutationFn: updateMyPlayMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_LIST],
      })
    },
  })

  return {
    updateCommunityMutation,
    deleteCommunityMutation,
    addCommunityMutation,
    insertMyMutation,
    updateMyMutation,
  }
}

export const useCoummunityCreateItem = () => {
  const insertMutation = useMutation({
    mutationFn: insertCurrentMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.CURRENT_MUSIC_INFO],
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCurrentMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.CURRENT_MUSIC_INFO],
      })
    },
  })
  return { updateMutation, insertMutation }
}
