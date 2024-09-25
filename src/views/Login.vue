<script setup lang="ts">
import { ref } from "vue";

interface UserData {
  login: string;
  password: string;
}

const userData = ref<UserData>({
  login: '',
  password: '',
})

const onSubmit = () => {
  console.log(userData.value);
}
</script>

<template>
  <div class="p-[32px] !h-[100vh] lg:flex md:flex block items-center relative">
    <img src="@/assets/images/loginBg.png"
         class="lg:block md:block hidden h-[100%] lg:w-[50%] md:w-[40%] rounded-lg object-cover" alt="login">

    <div class="lg:w-[25%] md:w-[50%] w-full m-auto">
      <div class="flex items-center mb-[24px]">
        <img src="@/assets/images/logo.png" alt="logo" class="shrink-1">
        <div class="flex flex-col ml-[12px]">
          <b class="text-[#000D24] text-[18px] mb-0">НГМК</b>
          <span class="text-[#CBCCCE]">Фонд</span>
        </div>
      </div>

      <b class="text-[#000D24] text-[24px] font-500 text-left">Войти в аккаунт</b><br>
      <span class="text-[#A8AAAE] text-[14px] font-400">Введите свои учетные данные для доступа к вашей учетной записи</span>

      <form @submit.prevent="onSubmit" class="mt-[24px]">
        <div class="flex-col flex">
          <label class="text-[#A8AAAE] text-[14px]">Логин</label>
          <input placeholder="Введите" class="custom-input mt-[4px]" v-model="userData.login" required/>
        </div>

        <div class="flex-col flex mt-[16px]">
          <label class="text-[#A8AAAE] text-[14px]">Пароль</label>
          <input placeholder="Введите" class="custom-input mt-[4px]" v-model="userData.password" required/>
        </div>
        <div class="text-right">
          <div class="text-[#2E90FA] text-[12px] mt-[4px] cursor-pointer block">Забыли пароль?</div>
        </div>

        <div class="mt-[24px] text-center">
          <button type="submit" class="w-full bg-[#2E90FA] py-[10px] text-white rounded-lg">Войти</button>

          <span class="text-[#7F7D83] py-[12px] flex items-center justify-between">
            <img src="@/assets/images/line.svg" alt="line">
            или
            <img src="@/assets/images/line.svg" alt="line">
          </span>

          <button class="w-full bg-[#4825C2] text-white py-[10px] flex items-center justify-center rounded-lg">
            ONE
            <img class="ml-[8px]" src="@/assets/images/oneId.svg" alt="oneId">
          </button>
        </div>
      </form>
    </div>

    <div class="text-[#A8AAAE] text-[14px] absolute right-[32px] bottom-[42px]">©{{ new Date().getFullYear()}} Anysoft</div>
  </div>
</template>

<style scoped>
.custom-input {
  outline: none;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #EEEEEF;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: #A8AAAE;
}
</style>