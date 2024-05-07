<script setup lang="ts">
import { ref } from 'vue'
import userCrud from '../components/modules/loginCRUD';
import { useRouter } from 'vue-router';
const { loginUser } = userCrud();
import orgInviteHelper from '../components/modules/orgInviteHelper';
const { numberOfInvites } = orgInviteHelper();

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {

  await loginUser(email.value, password.value).then((success: any) => {
    if(success) {
      router.push("/organizations");
      numberOfInvites();
    }
  })
}
</script>

<template>
  <form class="loginContainer my-auto mx-auto px-5 py-5 border rounded my-auto d-flex flex-column" @submit.prevent="login">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2">
        <span>Email/Username</span>
      </div>
      <div class="d-flex flex-row">
        <input type="text" v-model="email" class="form-control" />
      </div>
    </div>

    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2">
        <span>Password</span>
      </div>
      <div class="d-flex flex-row">
        <input type="password" v-model="password" class="form-control" />
      </div>
    </div>
    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2 justify-content-center">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </div>
  </form>
</template>
