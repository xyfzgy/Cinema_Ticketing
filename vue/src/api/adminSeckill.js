import request from '@/utils/request'
export const listSeckill = (params) => request.get('/admin/seckill/list', { params })
export const createSeckill = (data) => request.post('/admin/seckill', data)
export const updateSeckill = (data) => request.put('/admin/seckill', data)
export const deleteSeckill = (id) => request.delete(`/admin/seckill/${id}`)
