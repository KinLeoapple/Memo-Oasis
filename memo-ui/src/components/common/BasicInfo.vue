<script setup>
import {ref} from "vue";
import {basic_info} from "@/assets/js/api.js";

// Basic Information
const name = ref(null);
const quote = ref(null);
const quote_name = ref(null);
const desi_name = ref(null);
const desi_page = ref(null);

basic_info().then(r => {
  name.value = r.name;
  desi_name.value = r.desi_name;
  desi_page.value = r.desi_page;
  quote.value = r.quote;
  quote_name.value = r.quote_name;
});

defineExpose({name, quote, quote_name, desi_name, desi_page});
</script>