declare module 'next-auth' {
  interface session {
    user: {
        userId: string,
        name: string,
        email: string
    }
  }
}