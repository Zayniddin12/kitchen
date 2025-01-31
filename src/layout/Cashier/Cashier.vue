<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { formatNumber } from "@/utils/helper";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import HeaderUser from "@/components/layouts/header-user/HeaderUser.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import tokenManager from "@/utils/token.manager";
import { WarehouseCapacityParamsType } from "@/modules/Home/statistics.types";
import { useRoute } from "vue-router";
import QRCode from "qrcode";
import { useCashier } from "@/layout/Cashier/cashier";
import { ElMessage, ElMessageBox } from "element-plus";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";

interface ProductItemType {
  id: number;
  price: number;
  weight: number;
  name: string;
  photo: string | object;
}

const products = ref([]);
const orders = reactive<Map<number, number>>(new Map());
const ordersModal = ref(false);
let receiptIndex = ref(0);
const form = reactive<WarehouseCapacityParamsType>({
  management_id: 1,
});
const managements = ref<object[]>([
  {
    id: 1,
    name: "Завтрак",
  },
  {
    id: 2,
    name: "Первое",
  },
  {
    id: 3,
    name: "Второе",
  },
  {
    id: 4,
    name: "Салаты",
  },
  {
    id: 5,
    name: "Десерты",
  },
  {
    id: 6,
    name: "Добавки",
  },
  {
    id: 7,
    name: "Напитки",
  },

]);

const updateQuantity = (product_id: number, increment = true) => {

  const currentQuantity = orders.get(product_id) || 0;

  if (increment) {
    orders.set(product_id, currentQuantity + 1);
    ordersModal.value = true;
  } else if (currentQuantity > 0) {
    if (currentQuantity > 1) {
      orders.set(product_id, currentQuantity - 1);
    } else {
      orders.delete(product_id);

      if (orders.size === 0) ordersModal.value = false;
    }
  }
};

const kitchenStore = useKitchenStore();
const { confirm } = useConfirm();
const route = useRoute();
const authStore = useAuthStore();
const store = useCashier();


onMounted(async () => {
  if (tokenManager.getAccessToken()) authStore.me();

  route.query.management_id = form.management_id ? form.management_id : null;

  // Generate QR code on canvas
  QRCode.toCanvas(qrCanvas.value, qrData.value, {
    width: 200,
    errorCorrectionLevel: "H",
  }, (error) => {
    if (error) console.error("QR Code generation error:", error);
  });
});

const selectedProducts = computed(() => {
  const selected = [] as ProductItemType[];

  const productMap = new Map<number, ProductItemType>();

  products.value.forEach(product => {
    productMap.set(product.id, product);
  });

  orders.forEach((quantity, product_id) => {
    const product = productMap.get(product_id);
    if (product) {
      selected.push(product);
    }
  });

  return selected;
});

const ordersQQS = computed(() => {
  let totalSum = 0;

  orders.forEach((quantity, product_id) => {
    selectedProducts.value.forEach(product => {
      if (product.id === product_id) {
        totalSum += product.qqs_sum * quantity;
      }
    });
  });

  return totalSum;
});

const ordersSum = computed(() => {
  let totalSum = 0;

  orders.forEach((quantity, product_id) => {
    selectedProducts.value.forEach(product => {
      if (product.id === product_id) {
        totalSum += product.price * quantity;
      }
    });
  });

  return totalSum;
});

const createOrder = async () => {
  ElMessageBox.confirm("Хотите подтвердить заказ?", "", {
      confirmButtonText: "Да",
      cancelButtonText: "Отменить",
      type: "warning",
    },
  )
    .then(() => {
      let kt_id = JSON.parse(localStorage.getItem('workplace_id'))

      let payload = {
        kitchen_id: Number(kt_id),
        products: [],
        meals: [],
      };

      selectedProducts.value.forEach(product => {
        if (product.product_type == "product") {
          payload.products.push({
            id: Number(product.product_id),
            menu_id: Number(product.id),
            quantity: Number(orders.get(product.id)),
            price: Number(product.price),
          });
        } else {
          payload.meals.push({
            id: Number(product.product_id),
            menu_id: Number(product.id),
            quantity: Number(orders.get(product.id)),
            price: Number(product.price),
          });
        }
      });
      kitchenStore.CREATE_ORDER(payload);
      orders.clear();
      ordersModal.value = false;

      window.print();
      // await kitchenStore.GET_CURRENT_MENU_SALES_LIST(route.params.child_id as string);

    })
    .catch((e) => {
      console.log(e, 'rrr');
      ElMessage({
        type: "info",
        message: "Заказ отменен?",
      });
      orders.clear();
      ordersModal.value = false;
    });
};

watch(() => route.query.management_id, async (newId) => {
  const management_id = newId ? parseInt(newId as string) : null;
  form.management_id = management_id && !isNaN(management_id) ? management_id : null;
  let workplace_id = JSON.parse(localStorage.getItem("workplace_id"));

  let userRole = JSON.parse(localStorage.getItem("user_role"));
  if (!workplace_id) return;

  if (userRole == "cashier-sales") {
    const data = await store.GET_MENU_LIST({
      id: workplace_id,
      params: {
        period: newId,
      },
    });
    if (data) {
      products.value = store.menuList.elements;
    }
  }
}, { immediate: true });

const clearBasket = () => {
  confirm.delete().then(response => {
    orders.clear();
  });
};

const currentDate = computed(() => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
});

const generateReceiptIndex = computed(() => {
  receiptIndex.value += 1; // Increment the counter
  return receiptIndex.value;
});

const qrCanvas = ref(null);

const qrData = ref(JSON.stringify(selectedProducts.value));
</script>

<template>
  <div>
    <div class="text-left receipt">
      <p class="text-center">***Добро пожаловать!***</p>

      <div class="flex items-center flex-col my-[15px] justify-center">
        <img src="@/assets/images/logo.svg" alt="#" />
        <p class="text-center">NKMK JAMGARMASI</p>
      </div>

      <div class="my-2 flex items-center justify-between">
        <span class="text-sm">NKMK JAMGARMASI OSHXONASI</span>
      </div>

      <div class="my-2 flex items-center justify-between">
        <span class="text-sm">KASSIR:</span>
        <span class="text-sm">Begzod Rafiqov</span>
      </div>

      <span class="block border-[1px] border-dashed border-[#000]"></span>

      <div class="my-2 ">
        <!--        <span>Олинган махсулотлар рўйхати</span>-->
        <table style="width: 100%;">
          <thead>
          <tr>
            <th style="text-align: left; font-size: 12px; font-weight: normal; text-wrap: nowrap">Nomi</th>
            <th style="text-align: left; font-size: 12px; font-weight: normal; text-wrap: nowrap">QQS</th>
            <th style="text-align: right; font-size: 12px; font-weight: normal; text-wrap: nowrap">Soni</th>
            <th style="text-align: right; font-size: 12px; font-weight: normal; text-wrap: nowrap">Summa</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in selectedProducts" :key="item.name">
            <td><small class="text-xs">{{ item.name && item.name }}</small></td>
            <td><small class="text-xs">{{ item.qqs && item.qqs }}%</small></td>
            <td style="text-align: right;"><small class="text-xs">{{ orders.get(item.id) }}</small></td>
            <td style="text-align: right;"><small
              class="text-xs">{{ (item.price * Number(orders.get(item.id))).toLocaleString()
              }}</small></td>
          </tr>
          </tbody>
        </table>
      </div>

      <span class="block border-[1px] border-dashed border-[#000]"></span>

      <h6 class="mt-[10px] text-xs">JAMI:</h6>
      <div class="my-2 flex items-center justify-between">
        <span class="text-xs">Umumiy summa:</span>
        <span class="text-xs">{{ formatNumber(ordersSum) }} UZS</span>
      </div>
      <div class="my-2 flex items-center justify-between">
        <span class="text-xs">Umumiy QQS:</span>
        <span class="text-xs">{{ formatNumber(ordersQQS) }} UZS</span>
      </div>

      <span class="block border-[1px] border-dashed border-[#000]"></span>

      <div class="my-2 flex items-center justify-between">
        <span class="text-xs">To'lov sanasi:</span>
        <span class="text-xs">{{ currentDate }}</span>
      </div>
      <div class="my-2 flex items-center justify-between text-xs">Chek Nº: {{ generateReceiptIndex }}</div>


      <p class="text-center my-[20px]">***Приходите снова!***</p>

      <div class="flex flex-col items-center justify-center">
        <h2>QR Code</h2>
        <!-- Canvas for the QR code -->
        <canvas ref="qrCanvas"></canvas>
      </div>
    </div>

    <div class="bg-[#F8F9FC] flex gap-1 select-none no-receipt">
      <div class="w-[70%] p-4">
        <div class="inner">
          <div class="flex flex-col gap-y-6">
            <div>
              <div>
                <div class="flex items-center justify-between mb-[10px] xl:mb-[24px]">
                  <h4 class="text-[#000D24] text-[32px] font-semibold">
                    Меню
                  </h4>

                  <HeaderUser />
                </div>

                <div class="app-tabs2 !text-sm mb-6">
                  <RouterLink
                    v-for="item in managements"
                    :key="item.id"
                    :to="{ query: { ...route.query, ...{ management_id: item.id } } }"
                    :class="[
                           'app-tab',
                           { 'app-tab--active': form.management_id == item.id },
                         ]"
                  >
                    {{ item.name }}
                  </RouterLink>
                </div>

                <div class="overflow-y-auto h-[72vh] 2xl:h-[80vh] pr-2">
                  <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                       v-if="products.length > 0">
                    <div
                      v-for="productItem in products"
                      :key="productItem.id"
                      class="menu__card !p-[8px] !bg-white"
                    >

                      <img
                        :src="productItem.image"
                        :alt="productItem.name"
                        class="object-cover rounded-[12px] w-full h-[120px]"
                      />

                      <div class="menu__card-subtitles text-start mt-[12px] mb-[16px]">
                        <span class="text-[#000D24] font-semibold text-[20px] mb-[4px]">
                          {{ formatNumber(productItem.price) }} UZS
                        </span>
                        <span class="text-[#000D24] font-medium text-[14px]">{{ productItem.name }} </span>
                      </div>

                      <h5 class="text-start text-[#A8AAAE]">
                        {{ productItem.unit_name }}
                      </h5>

                      <div
                        v-if="orders.get(productItem.id)"
                        class="menu__card__actions !justify-between  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]">
                        <button
                          @click="updateQuantity(productItem.id, false)"
                          :disabled="!orders.has(productItem.id)"
                          class=""
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16602 9.99967H15.8327" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                        <span>
                        {{ orders.get(productItem.id) ?? 0 }}
                        </span>
                        <button
                          @click="updateQuantity(productItem.id)"
                          class=""
                          :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"
                        >
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                      </div>
                      <!--                      :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"-->
                      <button v-else
                              @click="updateQuantity(productItem.id)"

                              class="menu__card__actions  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                          <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>


                        Добавить
                      </button>
                    </div>
                  </div>

                  <div v-else class="grid grid-cols-1 text-center mt-[100px]">
                    <img src="@/assets/empty.svg" class="m-auto" alt="#" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <div
          ref="ordersWrapper"
          class="pt-8 pb-6 flex flex-col justify-between bg-white shadow-[-32px_72px_96px_0_#0926450F] rounded-l-[32px] h-screen"
        >
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-xl text-black font-semibold pl-8">Корзина</h4>
            <button v-if="orders.size" @click="clearBasket"
                    class="text-[#A8AAAE] text-[14px] bg-red-500 mr-6 text-white px-2 py-1 rounded-[8px]">
              Очистить
            </button>
          </div>
          <div class="h-full overflow-y-auto overflow-x-hidden flex flex-col">

            <div
              v-if="selectedProducts.length > 0"
              class="grid gap-2 px-6"
            >
              <!--              menu__card-->
              <div
                class="h-auto xl:h-[136px] p-[8px] flex items-center xl:items-stretch gap-2 bg-[#F8F9FC] rounded-[16px]"
                v-for="(productItem, productIndex) in selectedProducts"
                :key="productIndex"
              >
                <!--                {{productItem}}-->
                <!--                menu__card-img-->
                <img
                  :src="productItem.image"
                  :alt="productItem.name"
                  class="lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] 2xl:w-[120px] 2xl:h-[120px] w-[100px] object-cover rounded-[12px]"
                />
                <div class="w-full flex flex-col">
                  <div class="flex 2xl:items-center justify-between flex-col 2xl:flex-row">
                    <!--                    menu__card-title-->
                    <h5 class="text-[#000D24] xl:text-[14px] 2xl:text-[20px] font-semibold">
                      {{ formatNumber(productItem.price) }} UZS
                    </h5>

                    <span class="text-[#A8AAAE]">{{ productItem.unit_name }} </span>
                  </div>
                  <h5 class="text-[#000D24] font-medium text-[12px] xl:text-[14px] mt-[4px]">
                    {{ productItem.name }}
                  </h5>

                  <div
                    v-if="orders.get(productItem.id)"
                    class="menu__card__actions !justify-between  bg-[#E2E6F3] 2xl:px-[24px] 2xl:py-[14px] xl:px-[20px] xl:py-[10px] px-[16px] py-[6px] rounded-[12px] !mt-auto">
                    <button
                      @click="updateQuantity(productItem.id, false)"
                      :disabled="!orders.has(productItem.id)"
                      class=""
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16602 9.99967H15.8327" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                    <span class="h-[20px]">
                        {{ orders.get(productItem.id) ?? 0 }}
                        </span>
                    <button
                      @click="updateQuantity(productItem.id)"
                      class=""
                      :disabled="orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"
                    >
                      <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="m-auto text-center">
              <img src="@/assets/empty.svg" alt="#" />
              <span class="text-[#A8AAAE] text-[20px] font-medium">
                В вашей корзине <br>пока пусто
              </span>
            </div>
          </div>
          <div v-if="orders.size" class="mt-6 px-8">
            <button
              class="!bg-blue w-full flex items-center justify-between px-[24px] py-[14px] rounded-[12px] text-white"
              @click="createOrder"
            >
              Далее

              <strong class="font-semibold ml-auto">
                {{ formatNumber(ordersSum) }} сум
              </strong>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.el-message-box__container {
  justify-content: center;
}

.el-message-box__btns {
  justify-content: center;
}

.el-message-box__message p {
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.receipt {
  display: none;
}

@media print {
  .el-overlay {
    display: none;
  }

  .is-message-box {
    display: none;
  }

  @page {
    margin: 0;
  }


  .receipt {
    margin: 10px;
    display: block;
  }

  .no-receipt {
    display: none !important;
  }
}

* {

  scrollbar-width: thin;
  scrollbar-color: #f1f1f1;
}

.app-tabs2 {
  @apply bg-[#EFF1F8] p-1 inline-flex items-center rounded-lg font-medium text-xs leading-5;
}

.app-tab {
  @apply rounded-lg py-2.5 px-5 transition duration-100 text-dark-gray;

  &--active {
    @apply bg-white shadow-[0px_1.5px_4px_-1px_#0A090B12] text-dark;
  }
}

.menu {
  &__card {
    @apply rounded-2xl border border-[#E2E6F3] p-4 bg-[#F8F9FC] flex flex-col gap-x-3 text-center;

    &-img {
      @apply rounded-xl object-contain w-full mt-3;
    }

    &-title {
      @apply text-dark font-semibold text-xl;
    }

    &-subtitles {
      @apply flex flex-col gap-y-1 text-sm font-medium text-cool-gray mt-3;
    }

    &__actions {
      @apply mt-3.5 flex items-center justify-center gap-x-2 text-base font-medium text-dark-gray;
    }

    &__action {
      &-btn {
        @apply size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center;

        &__icon {
          @apply size-4;
        }
      }
    }
  }
}
</style>