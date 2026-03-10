export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event)
  const token = getCookie(event, "token")

  type Category = {
    id: number
    name: string
  }

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  try {
    const res = await $fetch<Category[]>(`${apiBaseUrl}/api/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    return res
  } catch (err: any) {
    const message = err?.data?.message || err?.message || "Failed to fetch categories"
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: message,
      data: err?.data,
    })
  }
})
