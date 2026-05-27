export const sendEmail = (payload: {
  email: { to: string; subject: string; html?: string }
  body: { header: string; body: string }
}) =>
  useRequest<string>(
    { url: 'admin/user/sendEmail', method: HTTP_METHODS.POST, data: payload },
    USER_ROLES.ADMIN
  )
