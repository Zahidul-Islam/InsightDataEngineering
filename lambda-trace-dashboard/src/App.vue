<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline" @click="$router.push('/')">
        <span>λ</span>
        <span class="font-weight-light">trace</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('dashboard')">
        <span class="mr-2">Dashboard</span>
      </v-btn>
      <v-btn text @click="$router.push('functions')">
        <span class="mr-2">Functions</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data: () => ({
    //
  }),
};
</script>
