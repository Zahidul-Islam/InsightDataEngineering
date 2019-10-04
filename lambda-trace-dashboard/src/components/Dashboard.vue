<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-12>
        <v-flex>
          <v-subheader
            >AWS Lambda ARN -
            arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci</v-subheader
          >
        </v-flex>
        <line-chart :chartData="datacollection"></line-chart>
        <button @click="fillData()">Randomize</button>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: null
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: ["128 MB", "256 MB", "512 MB", "1024 MB", "1536 MB", "3008 MB"],
        datasets: [
          {
            label: "Average Price",
            backgroundColor: "#DDE8B9",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          },
          {
            label: "Average Duration",
            backgroundColor: "#E8D2AE",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          },
          {
            label: "Total Cost",
            backgroundColor: "#D7B29D",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          }
        ]
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  }
};
</script>
<style>
.small {
  max-width: 800px;
  line-height: 2.5em;
  font-size: 1.25em;
  margin: 150px auto;
}
</style>
