export function hasAccess(userRole: string, allowedRoles: string[]) {
    return allowedRoles.includes(userRole);
}
  