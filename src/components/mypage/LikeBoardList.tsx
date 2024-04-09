import { getLikeBoardCount, getLikeBoardData } from '@/shared/mypage/api'
import { useStore } from '@/shared/store'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import BoardItem from './BoardItem'
import Pagination from './Pagination'
import BoardNoData from './BoardNoData'

const LikeBoardList = () => {
  const { userInfo } = useStore()
  const [currentPage, setCurrentPage] = useState(1)

  const { data: totalCount } = useQuery({
    queryFn: () => getLikeBoardCount(userInfo.uid),
    queryKey: ['likeBoardAllCount'],
    enabled: !!userInfo.uid,
  })

  const PER_PAGE = 2
  const totalPages = Math.ceil(totalCount! / PER_PAGE)
  const start = (currentPage - 1) * PER_PAGE
  const end = currentPage * PER_PAGE - 1

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getLikeBoardData(userInfo.uid, start, end),
    queryKey: ['likeBoard', userInfo.uid],
    enabled: !!userInfo.uid,
  })

  if (isError) {
    return '에러가 발생했어요!'
  }

  if (isLoading) {
    return '데이터를 불러오는 중입니다.'
  }

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }

  return (
    <section>
      <ul>
        {data ? (
          data?.map((item) => {
            return <BoardItem key={item.boardId} data={item} />
          })
        ) : (
          <BoardNoData />
        )}
      </ul>
      {data && data?.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        ''
      )}
    </section>
  )
}

export default LikeBoardList