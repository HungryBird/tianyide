<template>
  <div>
    <headers title="填写信息" showBack="true"></headers>
    <group label-width="4.5em" label-margin-right="1em">
      <x-input title="入葬人" placeholder="请输入入葬人的真实姓名"></x-input>
      <x-input title="发起人" placeholder="请输入发起人的真实姓名"></x-input>
    </group>
    <group label-width="4.5em" label-margin-right="1em">
      <datetime v-model="startDate" title="开始日期"></datetime>
      <datetime v-model="startTime" title="开始时间" format="HH:mm"></datetime>
    </group>
    <group label-width="4.5em" label-margin-right="1em">
      <x-input title="入葬地址" placeholder="请输入入葬地址"></x-input>
    </group>
    <div class="row-center margin-top-20">
      <div class="width-90">
        <x-button class="back-ffac38 color-fff" @click.native="$router.push('/template')">提交</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import { Group, XInput, Datetime, XButton } from 'vux'
  export default {
    data () {
      return {
        startDate: '',
        startTime: ''
      }
    },
    components: { headers, Group, XInput, Datetime, XButton }
  }
</script>

<style scoped>

</style>
