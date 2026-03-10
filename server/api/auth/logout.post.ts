export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const token = getCookie(event, "token")

  try {
    await $fetch(config.apiBaseUrl + "/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
  } catch (e) {
    console.warn("logout failed, clearing cookie anyway")
  }

  deleteCookie(event, "token", { path: "/" })

  return { success: true }

})
