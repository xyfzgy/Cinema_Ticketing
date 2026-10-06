import request from '@/utils/request'
export const listAdminSchedules = (params) => request.get('/admin/schedule/list', { params })
export const createSchedule = (data) => request.post('/admin/schedule', data)
export const updateSchedule = (data) => request.put('/admin/schedule', data)
export const deleteSchedule = (id) => request.delete(`/admin/schedule/${id}`)
export const changeScheduleStatus = (id, status) => request.put(`/admin/schedule/${id}/status`, null, { params: { status } })
