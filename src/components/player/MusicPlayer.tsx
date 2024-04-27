import { queryClient } from '@/app/provider'
import {
  GET_MUSIC_LIST_QUERY_KEYS,
  getMusicList,
} from '@/query/musicPlayer/musicPlayerQueryKeys'
import {
  insertMyPlayMusic,
  updateCurrentMusic,
  updateMyPlayMusic,
} from '@/shared/musicPlayer/api'
import { useCurrentMusicStore } from '@/shared/store/playerStore'
import { CurrentPlayListType } from '@/types/musicPlayer/types'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import Swal from 'sweetalert2'
import CurrentMusicList from './CurrentMusicList'
import Player from './Player'

const MusicPlayer = () => {
  const [currentPlaying, setCurrentPlaying] =
    useState<CurrentPlayListType | null>(null)
  const [musicIndex, setMusicIndex] = useState<number>(0)
  const [checkedList, setCheckedList] = useState<string[]>([])
  const [isLyrics, setIsLyrics] = useState(false)
  const [isRandom, setIsRandom] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const { data: userSessionInfo } = useSession()
  const uid = userSessionInfo?.user.uid as string

  const currentMusic = useCurrentMusicStore((state) => state.currentMusic)

  const { currentPlayList, myPlayList, isError } = getMusicList(uid)

  const deleteMutation = useMutation({
    mutationFn: updateCurrentMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_CURRENT_MUSIC_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.CURRENT_MUSIC_INFO],
      })
    },
  })

  const insertMutation = useMutation({
    mutationFn: insertMyPlayMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_INFO],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_LIST],
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateMyPlayMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_INFO],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_MUSIC_LIST_QUERY_KEYS.MY_MUSIC_LIST],
      })
    },
  })

  if (!currentPlayList) {
    return []
  }
  if (isError) {
    console.error('현재 플레이리스트를 가져오지 못했습니다')
    return
  }

  currentMusic(currentPlayList as CurrentPlayListType[])

  const onLyricsToggle = () => {
    setIsLyrics((prev) => !prev)
  }

  const onRandomMusicHandler = () => {
    setIsRandom((prev) => {
      return !prev
    })
  }

  const onPreviousHandler = () => {
    if (!isRandom) {
      if (musicIndex === 0) {
        setMusicIndex(currentPlayList.length - 1) // 마지막 곡으로 이동
        setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)
      } else {
        setMusicIndex((prev) => prev - 1) // 이전 곡으로 이동
        setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)
      }
    } else {
      setMusicIndex(Math.floor(Math.random() * currentPlayList.length))
      setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)
      // console.log('currentPlaying', currentPlaying)
    }
  }
  // (musicIndex === currentPlayList.length - 1)
  // console.log('musicIndex', musicIndex)
  const onNextTrackHandler = () => {
    if (!isRandom) {
      if (musicIndex === currentPlayList.length) {
        setMusicIndex(0) // 첫 번째 곡으로 돌아감
        setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)
        // console.log(
        //   '처음곡!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        //   currentPlaying,
        // )
      } else {
        // console.log('다음곡으로 왜안돼애애애애애앵')
        setMusicIndex((prev) => prev + 1) // 다음 곡으로 이동
        setCurrentPlaying(
          currentPlayList[musicIndex]
            ? (currentPlayList[musicIndex] as CurrentPlayListType)
            : null,
        )
        // setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)

        // console.log(
        //   '다음곡!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        //   currentPlaying,
        // )
      }
    } else {
      setMusicIndex(Math.floor(Math.random() * currentPlayList.length))
      setCurrentPlaying(currentPlayList[musicIndex] as CurrentPlayListType)
    }
  }
  // 처음 실행 시 노래 끝나고 다시 재생하거나 첫 인덱스에 있는 노래를 아래로 내리면 다음곡이 잘 넘어감 하지만 콘솔 상태변경은 매우잘됨 장난함?
  const onChangeCheckMusicHandler = (checked: boolean, id: string) => {
    if (checked) {
      setCheckedList((prev) => [...prev, id])
    } else {
      const checkList = checkedList.filter((el) => el !== id)
      setCheckedList(checkList)
    }
  }

  const onDeleteCurrentMusicHandler = async () => {
    Swal.fire({
      title: '선택한 노래를 삭제하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      background: '#2B2B2B',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        const currentMusicData = currentPlayList.filter(
          (music) => !checkedList.includes(music.musicId),
        )
        deleteMutation.mutate({
          uid,
          currentMusicData: currentMusicData.map((music) => music.musicId),
        })
        setCheckedList([])
        setSelectAll(false)
        const isCurrentMusicDeleted = checkedList.includes(
          currentPlaying!.musicId,
        )
        if (isCurrentMusicDeleted) {
          setCurrentPlaying(
            currentPlayList[musicIndex]
              ? (currentMusicData[0] as CurrentPlayListType)
              : null,
          )
        }
        Swal.fire({
          title: '재생목록이 삭제되었습니다.',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
          background: '#2B2B2B',
          color: '#ffffff',
        })
      }
    })
  }

  const onInsertMyPlayListHandler = async () => {
    if (checkedList.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '추가할 노래를 선택해 주세요',
        showConfirmButton: false,
        timer: 1500,
        background: '#2B2B2B',
        color: '#ffffff',
      })
      return
    }

    Swal.fire({
      title: '선택한 곡을 마이플레이 리스트에 추가하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      background: '#2B2B2B',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        if (myPlayList && myPlayList.length > 0) {
          const myIndex = myPlayList.flatMap((item) => {
            return item.myMusicIds
          })

          // some - || / every - &&
          const uniqueValues = checkedList.filter((value) => {
            return myIndex.every((item) => {
              return item !== value
            })
          })
          if (uniqueValues.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: '이미 추가된 노래입니다.',
              showConfirmButton: false,
              timer: 1500,
              background: '#2B2B2B',
              color: '#ffffff',
            })
            setCheckedList([])
            return
          } else {
            const updateList = [...myIndex, ...uniqueValues]
            updateMutation.mutate({ userId: uid, myMusicList: updateList })
            Swal.fire({
              icon: 'success',
              title: '마이플레이 리스트에 추가 되었습니다.',
              showConfirmButton: false,
              timer: 1500,
              background: '#2B2B2B',
              color: '#ffffff',
            })
            setCheckedList([])
          }
        } else {
          insertMutation.mutate({ userId: uid, musicId: checkedList })
          Swal.fire({
            icon: 'success',
            title: '마이플레이 리스트에 추가 되었습니다.',
            showConfirmButton: false,
            timer: 1500,
            background: '#2B2B2B',
            color: '#ffffff',
          })
          setCheckedList([])
        }
      }
    })
  }

  return (
    <div>
      <div className='min-h-[600px]'>
        <Player
          currentPlaying={currentPlaying}
          setCurrentPlaying={setCurrentPlaying}
          // currentPlayList={currentPlayList as CurrentPlayListType[]}
          musicIndex={musicIndex}
          isLyrics={isLyrics}
          isRandom={isRandom}
          onRandomMusicHandler={onRandomMusicHandler}
          onPreviousHandler={onPreviousHandler}
          onNextTrackHandler={onNextTrackHandler}
          onLyricsToggle={onLyricsToggle}
          onInsertMyPlayListHandler={onInsertMyPlayListHandler}
        />
      </div>
      <div>
        <CurrentMusicList
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          // currentPlayList={currentPlayList as CurrentPlayListType[]}
          currentPlaying={currentPlaying}
          isLyrics={isLyrics}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          setCurrentPlaying={setCurrentPlaying}
          onChangeCheckMusicHandler={onChangeCheckMusicHandler}
          onDeleteCurrentMusicHandler={onDeleteCurrentMusicHandler}
          setMusicIndex={setMusicIndex}
        />
      </div>
    </div>
  )
}
export default MusicPlayer
