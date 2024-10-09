<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import FromWhoModal from "@/layout/Create/components/FromWhoModal.vue";
import { ref } from "vue";

const emit = defineEmits(["update:editModal"]);
const props = defineProps({
  editModal: {
    type: Boolean,
    default: false,
  },
});
const editModal = ref<boolean>(false);

interface TableData {
  id: number;
  title: string;
  total_count: number;
  measurement: string;
  price: string;
  sum: string;
}

const tableData = ref<TableData[]>([
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
]);

const closeModal = () => {
  emit("update:editModal", false);
};

const headerClass = (item) => {
  console.log(item);

  return "p-0";
};

const openModals = () => {

  editModal.value = true;
};
</script>

<template>
  <el-dialog
    v-model="props.editModal"
    :show-close="false"
    class="w-[75%]"
    align-center
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">Создать приход</div>
    </template>

    <div class="flex mb-[40px]">
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[60%] mr-0">
        <div class="px-[72px] pb-[150px]">
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img
              src="@/assets/images/logo.svg"
              alt="logo"
            >
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">NKMK</b>
              <span class="text-[#CBCCCE]">Jamg‘armasi</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">НАКЛАДНОЙ</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата создания в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">NK-00000</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата накладной:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">247</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Вид документа:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Входящий накладной</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">От кого:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Руководитель группы отдела координации общественного питания</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Кому:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium whitespace-nowrap">Через кого:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Основание: </h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Назначение №2392</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Способ отправления:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">85 897 VAA</span>
          </div>

          <el-table
            :data="tableData"
            class="custom-element-table"
            header-cell-class-name="custom-cell-header"
            cell-class-name="custom-cell-header"
          >
            <el-table-column
              prop="title"
              label="Название"
              class="!p-0"
            />
            <el-table-column
              prop="total_count"
              label="Количество"
            />
            <el-table-column
              prop="measurement"
              label="Ед. измерения"
            />
            <el-table-column
              prop="price"
              label="Цена"
            />
            <el-table-column
              prop="sum"
              label="Сумма"
            />

            <template #append>
              <div class="flex items-center justify-end p-4">
                <h1 class="text-[#8F9194] text-[14px] font-bold mr-[5px]">Общая сумма: </h1>
                <h1 class="text-[#000D24] text-[14px] font-bold mr-5">7 040 000 сум</h1>
              </div>
            </template>

          </el-table>


        </div>
      </div>

      <div class="w-[40%] ml-[24px] flex flex-col justify-between">
        <div>
          <app-input
            placeholder="Накладние"
            label="Название документа"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-date-picker
            placeholder="24.08.2024"
            label="Дата создания документа"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="04-04-01/463"
            label="№ документа"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="NK-00000"
            label="NK-00000"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="№ накладной"
            label="№ накладной"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-date-picker
            placeholder="Дата накладной"
            label="Дата накладной"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="Входящий накладной"
            label="Входящий накладной"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-select
            placeholder="От кого"
            label="От кого"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          >
            <template #footer>
              <button
                @click="openModals"
                class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-[14px] font-medium py-[10px]"
              >
                <li
                  :style="{
                  maskImage: 'url(/icons/plusIcon.svg)',
                  backgroundColor: '#2E90FA',
                  color: '#2E90FA',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
                ></li>
                Добавить
              </button>
            </template>
          </app-select>

          <app-input
            placeholder="Руководитель группы отдела координации..."
            label="Руководитель группы отдела координации..."
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="Через кого"
            label="Через кого"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="Основание"
            label="Основание"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            class="mb-[32px]"
            placeholder="Способ отправления"
            label="Способ отправления"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />


          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
            <span class="block text-[#4F5662] text-[14px] font-medium mb-[16px]">
                Таблица получаемых продуктов
            </span>

            <app-select
              placeholder="Тип продукта"
              label="Тип продукта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-select
              placeholder="Вид продукта"
              label="Вид продукта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              placeholder="Количество"
              label="Количество"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              placeholder="Ед. измерения"
              label="Ед. измерения"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              placeholder="Цена"
              label="Цена"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              placeholder="Сумма"
              label="Способ отправления"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <button
              class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-[14px] font-medium py-[10px]"
            >
              <li
                :style="{
                  maskImage: 'url(/icons/plusIcon.svg)',
                  backgroundColor: '#2E90FA',
                  color: '#2E90FA',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
              ></li>
              Добавить
            </button>


          </div>
        </div>


        <!--        <div class="flex items-start justify-between">-->
        <!--          <button class="custom-cancel-btn" @click="closeModal">Отменить</button>-->
        <!--          <button class="custom-apply-btn">Сохранить как черновик</button>-->
        <!--          <button class="custom-send-btn">Отправить</button>-->
        <!--        </div>-->
      </div>
    </div>

    <div class="flex">
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[60%] mr-0">
        <div class="px-[72px] pb-[150px]">
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img
              src="@/assets/images/logo.svg"
              alt="logo"
            >
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">NKMK</b>
              <span class="text-[#CBCCCE]">Jamg‘armasi</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">АКТ</h1>

          <div class="flex items-center justify-between mb-[24px]">
            <div class="flex items-center mb-[8px]">
              <h1 class="text-[#4F5662] text-[14px] font-semibold">№:</h1>
              <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">04-04-01/463</span>
            </div>

            <div class="flex items-center mb-[8px]">
              <h1 class="text-[#4F5662] text-[14px] font-semibold">Дата:</h1>
              <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block"> 24.08.2024</span>
            </div>
          </div>

          <span class="block text-[#4F5662] text-[14px] font-normal leading-[20px] mb-[24px]">На основании данного документа мы подтверждаем, что следующая продукция принята в соответствии с правилами приемки продукции по количеству и качеству.</span>


          <div class="overflow-x-auto mb-[24px]">
            <table
              class="min-w-full border border-gray-300 bg-white text-left text-sm text-gray-900 rounded-[8px] border-separate table-my border-spacing-0"
            >

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Название продукта</td>
                <td class="p-2 border-b border-gray-300 ">Картофель</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Количество продукта</td>
                <td class="p-2 border-b border-gray-300">265</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Единица измерения</td>
                <td class="p-2 border-b border-gray-300">кг</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата договора о поставке</td>
                <td class="p-2 border-b border-gray-300">K1029745 от 25.07.2024</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата накладной</td>
                <td class="p-2 border-b border-gray-300">№ 365 26.08.2024</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Производитель продукта</td>
                <td class="p-2 border-b border-gray-300">OOO “Brend”</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Поставщик</td>
                <td class="p-2 border-b border-gray-300">OOO “Yuksalish”</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Получатель</td>
                <td class="p-2 border-b border-gray-300">РУ "Зарафшан"</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Транспорт</td>
                <td class="p-2 border-b border-gray-300">85 085 RRR</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата лицензии</td>
                <td class="p-2 border-b border-gray-300">№ L-86978576 от 05.02.2022</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата заключение
                  Санитарно-эпидемиологического центра
                </td>
                <td class="p-2 border-b border-gray-300">№ SM-069788 от 05.01.2024</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата удостоверения ветеринарии</td>
                <td class="p-2 border-b border-gray-300">№ ВТ-0365 от 10.01.2024</td>
              </tr>

              <tr class="border-gray-300">
                <td class="border-r border-b p-2 font-medium">Номер и дата удостоверения качества</td>
                <td class="p-2 border-b border-gray-300">№ УК-0614 от 07.02.2024</td>
              </tr>

            </table>
          </div>

          <div class="flex items-center justify-between mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Кладовщик:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block"> Эргашева Л.</span>
          </div>

          <div class="flex items-center justify-between mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Товаровед:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block"> Жалилов М.</span>
          </div>

          <div class="flex items-center justify-between mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Экспедитор:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Акромов О.</span>
          </div>

          <div class="flex items-center justify-between mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Зав. склад</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Каххоров А.</span>
          </div>

          <div class="flex items-center justify-between mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Начальник базы</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Маликов Б.</span>
          </div>


        </div>
      </div>

      <div class="w-[40%] ml-[24px] flex flex-col justify-between">
        <div>
          <app-input
            placeholder="АКТ"
            label="АКТ"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="NK-00000"
            label="NK-00000"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
            placeholder="АКТ-00000"
            label="АКТ-00000"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />


          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">
            <span class="block text-[#4F5662] text-[14px] font-medium mb-[16px]">
                Содержание акта
            </span>

            <app-input
              placeholder="Поле ввода текст содержания акта с выводом шаблонного заданного текста"
              type="textarea"
              :rows="5"
            />

            <app-input
              placeholder="Картофель"
              label="Картофель"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-input placeholder="50" />
            <app-input placeholder="кг" />
            <app-input
              placeholder="Номер и дата договора о поставке"
              label="Номер и дата договора о поставке"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-input
              placeholder="Номер и дата накладной"
              label="Номер и дата накладной"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-input
              placeholder="Производитель продукта"
              label="Производитель продукта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-input placeholder="OOO “Yuksalish”" />
            <app-input
              placeholder="Транспорт"
              label="Транспорт"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-date-picker
              placeholder="Номер и дата лицензии"
              label="Номер и дата лицензии"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-date-picker
              placeholder="Номер и дата заключения Санитарно..."
              label="Номер и дата заключения Санитарно..."
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-date-picker
              placeholder="Номер и дата удостоверения ветеринарии"
              label="Номер и дата удостоверения ветеринарии"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-date-picker
              placeholder="Номер и дата удостоверения качества"
              label="Номер и дата удостоверения качества"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

          </div>

          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
            <span class="block text-[#4F5662] text-[14px] font-medium mb-[16px]">
                Состав комиссии приема продуктов
            </span>

            <app-select
              placeholder="Кладовщик  Эргашева Л."
              label="Кладовщик"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-select
              placeholder="Товаровед  Жалилов М."
              label="Товаровед"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-select
              placeholder="Экспедитор  Акромов О."
              label="Экспедитор"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-select
              placeholder="Зав. склад  Каххоров А."
              label="Зав. склад"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
            <app-select
              placeholder="Начальник базы  Маликов Б."
              label="Начальник базы"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

          </div>

        </div>


      </div>
    </div>
    <div class="flex items-start justify-end gap-2 mt-[24px]">
      <button
        class="custom-cancel-btn"
        @click="closeModal"
      >Отменить
      </button>
      <button class="custom-send-btn">Отправить</button>
    </div>

    <FromWhoModal v-model:editModal="editModal" />
  </el-dialog>
</template>

<style lang="scss">
.custom-cell-header div {
  padding: 0 !important;
}

.table-my tr:last-child td {
  border-bottom: 0;
}

</style>
