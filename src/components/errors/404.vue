<script
  setup
  lang="ts"
>

const backToHome = () => {
  sessionStorage.setItem("current-menu", "0");
};
</script>

<template>
  <div class="flex flex-col justify-center h-[100vh]">
    <img
      src="@/assets/images/404.svg"
      class="m-auto mt-0 mb-0 w-[50%] h-[50%]"
      alt="404"
    />

    <div class="flex flex-col items-center">
      <div class="text-dark font-bold text-[32px]">Страница не найдена</div>
      <p class="text-base text-[#A8AAAE] font-[400] mt-[8px] mb-[24px] lg:w-[30%] md:lg:w-[30%] w-full m-auto text-center">
        Извините, запрошенная вами страница не найдена пожалуйста, вернитесь на
        главную страницу
      </p>
      <RouterLink
        :to="{name: 'home'}"
        class="bg-[#2E90FA] w-[200px] py-[10px] rounded-lg text-white m-auto px-2 flex justify-center"
        @click="backToHome"
      >
        Вернуться на главную
      </RouterLink>
    </div>
  </div>
</template>
