<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "~/composables/useMessage"

definePageMeta({
  layout: "dashboard",
  requiresAuth: true,
})

useHead({
  title: "Dashboard - Product Management",
  meta: [
    {
      name: 'description',
      content: 'Manage your products in the dashboard.'
    }
  ]
});



const router = useRouter()
const { errorMsg, successMsg } = useMessage()

// --------------------
// Types
// --------------------
type Category = { id: number; name: string }
type Product = { id: number; name: string; category: Category; status: string }
type PaginatedProducts = {
  current_page: number
  data: Product[]
  last_page: number
  per_page: number
  total: number
}

// --------------------
// State
// --------------------
const products = ref<Product[]>([])
const loading = ref(false)
const searchInput = ref("")
const searchQuery = ref("")
const page = ref(1)
const perPage = 5
const total = ref(0)
const lastPageValue = ref(1)

// --------------------
// Fetch products
// --------------------
const fetchProducts = async () => {
  loading.value = true
  errorMsg.value = null

  try {
    const res = await $fetch<PaginatedProducts>("/api/products", {
      method: "GET",
      query: { q: searchQuery.value, page: page.value, perPage },
    })

    products.value = res.data
    total.value = res.total
    lastPageValue.value = res.last_page
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to fetch products"
    products.value = []
    total.value = 0
    lastPageValue.value = 1
  } finally {
    loading.value = false
  }
}

// Fetch on page load
onMounted(fetchProducts)

// --------------------
// Computed
// --------------------
const paginated = computed(() => products.value)

// --------------------
// Search (with debounce)
// --------------------
let debounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
    fetchProducts()
  }, 400)
})

const product = total ;
</script>



<template>

  <div class="bg-[#0f172a] min-h-screen p-6">

    <!-- Header -->
    <div class="max-w-6xl mx-auto mb-6">
      <h1 class="text-3xl font-bold  text-white">Product List</h1>
      <p class="text-white">Total Products:
        <span class="font-semibold  text-red-500">{{ total }}</span>
      </p>
    </div>

    <!-- Product Grid -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- Product Card -->
      <div v-for="product in products" :key="product.id"
        class="bg-[#0f172a] text-gray-100 border-2 border-sky-500 rounded-xl shadow-md p-5 hover:shadow-lg transition">

        <!-- Category Badge -->
        <div class="flex justify-between items-center mb-3">
          <h4 class="bg-blue-100 text-blue-600 text-xs  px-3 py-1 rounded-full">
            id: {{ product.id }}
          </h4>

          <span class="text-sm text-gray-500">
            Hi: <span class="font-bold text-green-600">168</span>
          </span>
        </div>

        <!-- Product Name -->
        <h2 class="text-lg font-semibold text-sky-400 mb-2">
          {{ product.name }}
        </h2>
      </div>
    </div>
  </div>
</template>
