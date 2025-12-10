<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoleStore } from "@/modules/Settings/components/Reference/Role/role.store";
import { RoleType } from "@/modules/Settings/components/Reference/Role/role.types";
import { useCommonStore } from "@/stores/common.store";

const { t } = useI18n();
const route = useRoute();
const roleStore = useRoleStore();
const showModal=ref(false)
const commonStore = useCommonStore();
// Breadcrumb
const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);
const acceptPermissions=ref<any>()
const permissionList=ref<any>()
const checkedList=ref<any>([])
const updatedPermissions = ref([])
const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    { label: "common.settings", isTranslate: true, to: { name: "reference" } },
    { label: "settings.directories", isTranslate: true, to: { name: "reference" } },
    { label: "settings.positionsAndRoles", isTranslate: true, to: { name: "reference" } },
    { label: title.value, isActionable: true, isTranslate: isTranslate.value }
  ]);
};

const form = reactive({ search: "" });

// Expand open/close
const tableRef = ref();
const activeId=ref(null)
const toggleRow = async (row: RoleType) => {
  activeId.value=row.id
 await roleStore.fetchPermissionsById(row.id).then((data)=>{
    acceptPermissions.value=roleStore.permissionsbyId
  });
  tableRef.value.toggleRowExpansion(row);

 if (permissionList.value?.length>0){
   updatedPermissions.value = permissionList.value.map(module => {
     return {
       ...module,
       permissions: module.permissions.map(p => {
         const isAccepted = acceptPermissions.value?.some(ap => ap.name === p.name) ? true : false;
         return {
           ...p,
           isChecked: isAccepted
         }
       })
     }
   })
 }
 checkedList.value=acceptPermissions.value?.map(ap=>ap.name)
};


function addCheckedList(item:any){
 if (!item.isChecked){
   checkedList.value.push(item.name)
 }else{
   checkedList.value=checkedList.value.filter(i=>i!==item.name)
 }

}

async function updateData(row:any){
 await roleStore.updatePermissions(row.id, checkedList.value)
   tableRef.value.toggleRowExpansion(row);
}
async function deleteRole(){
  await roleStore.deleteRoleById(activeId.value)
 await roleStore.fetchRoles();
 await roleStore.fetchPermissions().then((data)=>{permissionList.value=roleStore.permissions});
  showModal.value=false
}

function openModal(row:any){
  activeId.value=row.id
  showModal.value=true
}
// Load roles
onMounted(() => {
  setBreadCrumbFn();
  roleStore.fetchRoles();
  roleStore.fetchPermissions().then((data)=>{permissionList.value=roleStore.permissions});
});
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h1 class="text-black-text font-semibold text-[32px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
    </div>

    <ElTable
      ref="tableRef"
      v-loading="roleStore.rolesLoading"
      :data="roleStore.roles"
      class="custom-element-table mt-6"
      :empty-text="t('common.empty')"
    >
      <!-- EXPAND ROW -->
      <ElTableColumn type="expand">
        <template #default="{ row }">
          <div class="p-4 bg-[#fafafa] rounded-xl border">
            <div class="grid grid-cols-1 gap-4">
              <template v-for="perm in updatedPermissions" :key="perm.id">
                <div class=" bg-white p-3 rounded-lg shadow-sm">
                  <div class="flex items-center gap-2">
                    <span>{{ perm?.module_title }}</span>
                  </div>
                  <div class="grid grid-cols-4 gap-4">
                    <template v-for="item in perm?.permissions" :key="perm.id">
                      <div class="flex items-center gap-2 p-3 rounded-lg shadow-sm">
                        <ElCheckbox v-model="item.isChecked" @click="addCheckedList(item)"  />
                        <span>{{ item?.name }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <ElButton size="small" type="primary" @click="updateData(row)">
                {{ t('submit') }}
              </ElButton>
            </div>

          </div>
        </template>
      </ElTableColumn>

      <!-- Number -->
      <ElTableColumn prop="idx" label="№" width="80">
        <template #default="{$index}">
          {{ $index + 1 }}
        </template>
      </ElTableColumn>

      <!-- Name -->
      <ElTableColumn prop="title" :label="t('role.name2')" sortable>
        <template #default="{ row }">
          {{ row.title ?? "-" }}
        </template>
      </ElTableColumn>

      <!-- Parent -->
      <ElTableColumn
        align="center"
        prop="parent_name"
        :label="t('role.ownership')"
        :width="250"
        sortable
      >
        <template #default="{ row }">
          {{ row.parent_name || "-" }}
        </template>
      </ElTableColumn>

      <!-- Users count -->
      <ElTableColumn
        prop="users_count"
        :label="t('role.numberOfUses')"
        align="center"
        sortable
      >
        <template #default="{ row }">
          {{ row.users_count ?? 0 }}
        </template>
      </ElTableColumn>

      <!-- ACTIONS -->
      <ElTableColumn align="center" label="">
        <template #default="{ row }">
         <div class="flex items-center gap-2">
           <ElButton :loading="roleStore.permissionsLoading && activeId==row.id" size="small" type="primary" class="!relative" @click="toggleRow(row)">
             {{ t('edit') }}
           </ElButton>

           <ElButton size="small" type="danger" @click="()=>openModal(row)">
             {{t('delete')}}
           </ElButton>
         </div>
        </template>
      </ElTableColumn>
    </ElTable>
    <el-dialog
      v-model="showModal"
      :show-close="false"
      class="xl:w-[35%] md:w-[75%]"
      align-center
      append-to-body
      :before-close="closeModal"
    >
      <div>
        <h3>{{t('areYouSureDelete')}}</h3>
        <div class="flex items-center justify-end gap-x-4 mt-4">
          <ElButton  size="small" type="primary" class="!relative" @click="deleteRole">
            {{ t('yes') }}
          </ElButton>

          <ElButton size="small" type="danger" >
            {{ t('no') }}
          </ElButton>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<style>
table .el-icon {
  display: none;
}
</style>