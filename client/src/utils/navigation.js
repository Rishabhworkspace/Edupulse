export const getDashboardUrl = (role) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'instructor': return '/instructor';
    default: return '/dashboard';
  }
};
