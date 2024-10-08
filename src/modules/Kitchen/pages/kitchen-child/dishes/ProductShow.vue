<script
    setup
    lang="ts"
>

const tableData = Array(4).fill({
  compound: "Рис",
  quantity: 50,
  unit_measurement: "грамм",
  price: 25000
});

</script>

<template>
  <section>
    <div>
      <h1 class="text-[32px] font-semibold text-dark">
        Плов
      </h1>
      <div class="min-h-[67vh] max-w-[792px] rounded-3xl border border-[#E2E6F3] p-6 mt-6">
        <h6 class="text-dark font-medium text-lg">
          Состав рациона
        </h6>
        <ElTable
            :data="tableData"
            class="custom-element-table-normal custom-element-table mt-4 custom-element-table--has-append"
        >
          <ElTableColumn
              label="Состав"
              prop="compound"
          ></ElTableColumn>
          <ElTableColumn
              label="Количество"
              prop="quantity"
          ></ElTableColumn>
          <ElTableColumn
              label="Ед. измерения"
              prop="unit_measurement"
          ></ElTableColumn>
          <ElTableColumn
              label="Цена"
              prop="price"
              sortable
          ></ElTableColumn>
          <template #append>
            <div class="px-4 py-3.5 flex justify-end items-center gap-x-8">
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
          </template>
        </ElTable>
      </div>
    </div>
  </section>
</template>