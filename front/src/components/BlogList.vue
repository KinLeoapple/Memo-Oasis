<script setup>

</script>

<template>
  <div class="row ml-5 mr-5">
    <div
        style="height: 100%; width: 100%; display: flex;"
        class="flex-direction-column md6 lg"
    >
      <VaInfiniteScroll
          :load="appendRecordsAsync">
        <div
            v-for="(record, index) in records"
            :key="index"
        >
          List item and some text #{{ index }}
        </div>
      </VaInfiniteScroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [{}, {}, {}, {}, {}, {}, {}],
    };
  },
  methods: {
    async appendRecordsAsync() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.records.push({});
    },
  },
};
</script>

<style scoped>

</style>