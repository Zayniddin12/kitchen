<script setup lang="ts">

</script>

<template>
  <div class="flex items-start justify-center">
    <div class="border-[#E2E6F3] border rounded-[15px] w-[50%] mr-0">
      <div class="px-[72px] pb-[50px]">
        <header class="flex items-center justify-center my-[24px] mb-6">
          <img src="@/assets/images/logo.svg" alt="logo">
          <div class="flex flex-col ml-3">
            <b class="text-[#000D24] text-lg">NKMK</b>
            <span class="text-[#CBCCCE]">Jamg‘armasi</span>
          </div>
        </header>
        <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">АКТ</h1>

        <div class="flex items-center justify-between">
          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] block">04-04-01/463</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] block">24.08.2024</span>
          </div>
        </div>

        <div class="text-[#4F5662] text-[14px]">
          На основании данного документа мы подтверждаем, что следующая продукция принята в соответствии с правилами
          приемки продукции по количеству и качеству.
        </div>

        <table class="my-[24px] min-w-full table-auto border-collapse rounded-[15px] overflow-hidden">
          <tbody>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Название продукта</th>
            <td class="border p-4">Картофель</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Количество продукта</th>
            <td class="border p-4">265</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Единица измерения</th>
            <td class="border p-4">кг</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата договора о поставке</th>
            <td class="border p-4">K1029745 от 25.07.2024</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата накладной</th>
            <td class="border p-4">№ 365 26.08.2024</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Производитель продукта</th>
            <td class="border p-4">OOO “Brend”</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Поставщик</th>
            <td class="border p-4">OOO “Yuksalish”</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Получатель</th>
            <td class="border p-4">РУ "Зарафшан"</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Транспорт</th>
            <td class="border p-4">85 085 RRR</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата лицензии</th>
            <td class="border p-4">№ L-86978576 от 05.02.2022</td>
          </tr>
          <tr>
            <th class="border  bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата заключение
              Санитарно-эпидемиологического центра
            </th>
            <td class="border  p-4">№ SM-069788 от 05.01.2024</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата удостоверения ветеринарии</th>
            <td class="border p-4">№ BT-0365 от 10.01.2024</td>
          </tr>
          <tr>
            <th class="border bg-[#E2E6F3]-100 p-4 text-left font-semibold">Номер и дата удостоверения качества</th>
            <td class="border p-4">№ YK-0614 от 07.02.2024</td>
          </tr>
          </tbody>
        </table>

        <div class="mt-[40px] flex items-center justify-between" v-for="(item, index) in 5" :key="index">
          <div class="flex items-baseline mb-[24px] w-[200px]">
            <h1 class=" text-[14px] text-[#4F5662] font-medium">
              Кладовщик:
            </h1>
          </div>

          <img src="@/assets/images/icons/qr.svg" alt="qr" />

          <h1 class="text-[#A8AAAE] text-[14px] mr-[100px]">Эргашева Л.</h1>
        </div>
      </div>
    </div>

    <div>
      <button class="custom-white-btn ml-[24px] w-[260px]">
        <img src="@/assets/images/icons/plane.svg" alt="plane" class="mr-[12px]" />
        Отправить
      </button>
      <button class="custom-white-btn ml-[24px] w-[260px] my-[8px]">
        <img src="@/assets/images/icons/print.svg" alt="plane" class="mr-[12px]" />
        Печать
      </button>
      <button class="custom-white-btn ml-[24px] w-[260px]">
        <img src="@/assets/images/icons/download.svg" alt="plane" class="mr-[12px]" />
        Скачать
      </button>
    </div>
  </div>
</template>
