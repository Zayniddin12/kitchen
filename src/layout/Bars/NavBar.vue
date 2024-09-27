<script setup lang="ts">
import { Bell, Message, Search } from "@element-plus/icons-vue";
import Language from "@/components/language/index.vue";
</script>

<template>
  <div class="flex justify-between items-start">
    <div class="relative">
      <el-icon class="absolute top-[50%] translate-y-[-50%] left-[19px] z-9999" color="#8F9194">
        <Search />
      </el-icon>
      <input class="bg-[#F8F9FC] w-[552px] rounded-2xl text-black px-[16px] py-[12px] pl-[50px] outline-none"
             placeholder="Поиск">
    </div>
    <div class="flex items-center gap-6">


      <button class="flex items-center bg-[#2E90FA] rounded-[8px] py-[10px] px-[20px]">
        <svg class="mr-[8px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.3335" y="3.33301" width="13.3333" height="13.3333" rx="2" stroke="white" stroke-width="1.2"
                stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.5 9.99967H12.5" stroke="white" stroke-width="1.2" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M10.0002 7.5V12.5" stroke="white" stroke-width="1.2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>

        <span style="vertical-align: middle"> Создать </span>
      </button>


      <el-badge value="18" class="item">
        <el-icon color="#8F9194" size="24">
          <Bell />
        </el-icon>
      </el-badge>

      <el-badge value="18" class="item">
        <el-icon color="#8F9194" size="24">
          <Message />
        </el-icon>
      </el-badge>

      <Language />

      <div class="flex items-center gap-3 el-dropdown-link">
        <el-avatar :size="40"
                   src="https://s3-alpha-sig.figma.com/img/62bb/af5c/86dedb75e145655a70472a6f12327762?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MMrfktOFmOp6Sa9P6uBZhUp1cfMuJOyyfuOA2nmF06gho~IBpQt-xt3EPbkWBfUx8EQ3aVzxyN41Ob20wl8EWVUoTQL0ZK92KTheiWHp80PG~F7Vxcew5yFJzZusz0hlktZNhAlpS9NsiihRk3d5EJNmiGkoZch9f~g~CoZHrXc5cBdGebm217J~9ROTxf~q-6MGhb5G4h4dqfBpHrXT1I-xdKVFM-4LJWekpeJC-WHnUAQNi6jKZHiw2ZvRutwWmUcWZhaS7UAYUVhnctTe-nVZ4OUjHP-9yWYgomsU6eG8Bwx83Oynvz26qJp4J6MCnSGV7MhWUnjcoBNwxoM4YA__" />
        <div class="">
          <h2 class="m-0 text-[14px] font-medium text-black">Мухаммадамин Нурматов</h2>
          <span class="text-[#A8AAAE] text-sm">Директор</span>
        </div>
      </div>
    </div>
  </div>
</template>
