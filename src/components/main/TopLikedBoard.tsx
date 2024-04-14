'use client'

import { getTopLikedBoardData } from '@/shared/main/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import SectionTitle from './SectionTitle'
import next from '@/../public/images/next.svg'
import prev from '@/../public/images/prev.svg'
import heart from '@/../public/images/heart-rounded-gray.svg'
import message from '@/../public/images/message-text-square-02-gray.svg'
import { useSession } from 'next-auth/react'

const TopLikedBoard = () => {
  const [position, setPosition] = useState(0)
  const session = useSession()

  const check = session.status === 'authenticated'

  const MOVE_POINT = 354 + 16 //임시값 - 슬라이드로 이동할 값

  const { data, isError, isLoading } = useQuery({
    queryFn: () => getTopLikedBoardData(),
    queryKey: ['topLikedBoard'],
  })

  const onClickPrevHandler = () => {
    if (position < 0) {
      setPosition((prev) => prev + MOVE_POINT)
    }
  }

  const onClickNextHandler = () => {
    setPosition((prev) => prev - MOVE_POINT)
  }

  const itemShadow =
    'shadow-[0px_4px_1px_-1px_#00000033,0px_4px_8px_#00000019,0px_0px_0px_1px_#ffffff19,inset_0px_-1px_2px_#00000033]'

  const shadow =
    'shadow-[0px_4px_1px_-1px_#00000033,0px_4px_8px_#0000001a,0px_0px_0px_1px_#ffffff26,inset_0px_2px_0px_#ffffff1a,inset_0px_-1px_2px_#00000033,inset_0px_-4px_1px_#00000033]'

  if (isError) {
    return '에러 발생'
  }

  if (isLoading) {
    return '로딩중'
  }

  return (
    <section className={`${!check ? 'pl-10' : 'pl-20'} mb-[7.8rem] mt-12`}>
      <SectionTitle>지금 핫한 게시글 🔥</SectionTitle>
      <div className='relative flex overflow-hidden'>
        <ul
          className=' flex flex-nowrap px-[1px] py-1'
          style={{
            transition: 'all 0.4s ease-in-out',
            transform: `translateX(${position}px)`,
          }}
        >
          {data
            ?.sort((a, b) => {
              return (
                (!b.likeList ? 0 : b.likeList?.length) -
                (!a.likeList ? 0 : a.likeList?.length)
              )
            })
            .map((item) => {
              const likedLength = item.likeList ? item.likeList.length : 0

              return (
                <li
                  key={item.boardId}
                  className={`mr-4 w-[356px] rounded-[2rem] border-4 border-[#00000070] bg-[#ffffff19] p-4 ${itemShadow}`}
                >
                  <div className='flex items-center'>
                    <figure className='flex h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-slate-200'>
                      {item.userInfo.userImage && (
                        <Image
                          src={item.userInfo.userImage}
                          alt={item.userInfo.nickname!}
                          width={24}
                          height={24}
                        />
                      )}
                    </figure>
                    <span className='pl-[6px] text-[1.125rem] font-semibold'>
                      {item.userInfo.nickname}
                    </span>
                  </div>
                  <Link
                    href={`/community/${item.boardId}`}
                    className='mt-4 block overflow-hidden text-ellipsis whitespace-nowrap tracking-[-0.03em] text-[#ffffff4c]'
                  >
                    {item.boardTitle}
                  </Link>
                  <div className='mt-9 flex items-center justify-end gap-2 text-[0.875rem] text-[#ffffff4c]'>
                    <Image
                      src={message}
                      width={24}
                      height={24}
                      alt='댓글 아이콘'
                    />{' '}
                    {item.comment ? item.comment.length : 0}
                    <Image
                      src={heart}
                      width={24}
                      height={24}
                      alt='좋아요 아이콘'
                    />{' '}
                    {likedLength}
                  </div>
                </li>
              )
            })}
        </ul>
        <div>
          {position !== ((data?.length as number) - 1) * -MOVE_POINT && (
            <button
              type='button'
              className={`absolute right-[1px] top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#0000001a] bg-[#ffffff19] text-white backdrop-blur-md ${shadow}`}
              onClick={onClickNextHandler}
            >
              <Image
                src={next}
                width={24}
                height={24}
                alt='다음으로 넘어가기'
              />
            </button>
          )}
          {position !== 0 && (
            <button
              type='button'
              className={`absolute left-[1px] top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#0000001a] bg-[#ffffff19] text-white backdrop-blur-md ${shadow}`}
              onClick={onClickPrevHandler}
            >
              <Image
                src={prev}
                width={24}
                height={24}
                alt='이전으로 넘어가기'
              />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default TopLikedBoard
