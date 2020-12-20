import { useEffect, useState } from 'react'

export const useInitTable = (api:any, initFilters:any) => {
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: 10,
    ...initFilters
  });
  // 表单数据
  const [list, setList] = useState();
  // 列表总数
  const [total, setTotal] = useState(0);
  // 是否在加载中
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getList({...filters});
    // eslint-disable-next-line
  }, [filters])

  // 获取列表
  const getList = async (filters:any) => {
    setLoading(true);
    const resData = await api(filters);
    setLoading(false);
    setList(resData.data.rows);
    setTotal(resData.data.total);
  }

  // 更改页数
  const changePage = (pagination: any) => {
    setFilters({
      ...filters,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  return {
    filters,
    list,
    total,
    loading,
    changePage,
    setFilters,
    getList
  }
}