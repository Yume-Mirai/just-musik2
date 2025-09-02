// Utility functions for role-based access control

export const isAdmin = (user) => {
  return user && user.roles && user.roles.includes('ROLE_ADMIN')
}

export const isUser = (user) => {
  return user && user.roles && user.roles.includes('ROLE_USER')
}

export const hasRole = (user, role) => {
  return user && user.roles && user.roles.includes(role)
}

export const getUserRoleDisplay = (user) => {
  if (isAdmin(user)) return 'Administrator'
  if (isUser(user)) return 'User'
  return 'Unknown'
}