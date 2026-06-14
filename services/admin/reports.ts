import { USER_ROLES, HTTP_METHODS } from "~/constants";

export const getReports = async (page: number = 1, limit: number = 20) =>
  useRequest({
    url: `/admin/conversation/reports?page=${page}&limit=${limit}`,
    method: HTTP_METHODS.GET,
  }, USER_ROLES.ADMIN);

export const updateReportStatus = async (id: string, status: 'reviewed' | 'resolved' | 'pending') =>
  useRequest({
    url: `/admin/conversation/reports/${id}`,
    method: HTTP_METHODS.PATCH,
    data: { status },
  }, USER_ROLES.ADMIN);

export const deleteComment = async (commentId: string) =>
  useRequest({
    url: `/admin/conversation/comments/${commentId}`,
    method: HTTP_METHODS.DELETE,
  }, USER_ROLES.ADMIN);
