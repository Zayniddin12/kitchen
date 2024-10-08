<script
    setup
    lang="ts"
>
import { useRoute } from "vue-router";
import { ref } from "vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";

const route = useRoute();

const num = ref(1);

const tableData = ([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    doc: "852369",
    theme: "Доставка мяса",
    send: "Зарафшан",
    receive: "Фонд"
  },
  {
    id: 2,
    num: "2",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд"
  },
  {
    id: 3,
    num: "3",
    date: "21.08.2024",
    doc: "584534",
    theme: "Доставка лука",
    send: "Навои",
    receive: "Фонд"
  },
  {
    id: 4,
    num: "4",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд"
  }
]);
</script>

<template>
  <section>
    <div>
    <span class="mb-[24px] text-[32px] text-[#000D24] font-semibold	block"> {{
        route.meta.title ? route.meta.title : ""
      }}</span>

      <div class="bg-[#FFFFFF] min-h-[65vh] border border-[#E2E6F3] rounded-[24px] p-[24px]">

        <div class="flex items-center gap-4 w-[70%]">
          <app-select
              class="w-full"
              label="Рацион"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              placeholder="Выберите рацион"
          />
          <app-input
              class="w-full"
              placeholder="Введите количество порций"
              label="Порция"
              pla
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />
        </div>

        <div class="mb-[24px]">
          <el-table
              :data="tableData"
              class="custom-element-table"
          >
            <el-table-column
                prop="num"
                label="Ингредиенты"
            />
            <el-table-column
                prop="date"
                label="Количество"
            />
            <el-table-column
                prop="doc"
                label="Ед. измерения"
            />
            <el-table-column
                prop="doc"
                label="Сумма"
            />

            <template #append>
              <div class="px-4 py-3.5 flex justify-end items-center ">

                <div class="flex items-center gap-x-8">
                  <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            Цена:
                          </span>
                    <strong class="font-semibold text-dark">
                      25 000 сум
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            НДС:
                          </span>
                    <strong class="font-semibold text-dark">
                      3 000 сум
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            Общая сумма:
                          </span>
                    <strong class="font-semibold text-dark">
                      28 000 сум
                    </strong>
                  </div>
                </div>
              </div>
            </template>

          </el-table>


        </div>

      </div>
    </div>
  </section>
</template>

<style
    scoped
    lang="scss"
>

</style>