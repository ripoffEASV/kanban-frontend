import authService from '../../auth/authService'
const { isLoggedIn } = authService()

export default function routerGuard() {
  const requireAuth = (to, from, next) => {
    if (!isLoggedIn()) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  }
  return { requireAuth }
}
