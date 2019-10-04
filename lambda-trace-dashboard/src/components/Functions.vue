<template>
  <v-container>
    <v-layout wrap>
      <v-flex mb-6>
        <v-list three-line>
          <template v-for="(item, index) in functions">
            <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>

            <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

            <v-list-item v-else :key="item.title">
              <v-list-item-content>
                <v-list-item-title v-html="item.arn"></v-list-item-title>
                <v-list-item-subtitle>
                    <v-chip class="ma-2" small v-for="(power, idx) in item.powerConfiguration" :key="idx">{{power}}MB</v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {data: () => ({
      functions: [
        { header: 'Functions' },
        {
          arn: 'ARN - arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
          powerConfiguration: [128, 256, 512, 1024, 1536, 3008 ]
        },
        { divider: true, inset: true },
        {
          arn: 'ARN - arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
          powerConfiguration: [1536, 3008 ]
        },
        { divider: true, inset: true },
        {
          arn: 'ARN - arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
          powerConfiguration: [512, 1024, 1536, 3008 ]
        },
        { divider: true, inset: true },
        {
          arn: 'ARN - arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci',
          title: 'Birthday gift',
          subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?",
          powerConfiguration: [128, 256, 1536, 3008 ]
        },
        { divider: true, inset: true },
        {
          arn: 'ARN - arn:aws:lambda:us-west-2:920141199774:function:lambda-trace-dev-fibonacci',
          title: 'Recipe to try',
          subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
          powerConfiguration: [128, 256, 512, 1024 ]
        },
      ],
    }),
  }
</script>
