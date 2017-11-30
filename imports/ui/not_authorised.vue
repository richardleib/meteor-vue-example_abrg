<template>
  <b-container>
    <b-row>
      <b-col>
        <b-jumbotron header="403"
                     lead="You are not authorised">

          <b-button-group size="lg">
            <router-link class="btn btn-primary"
                         :to="{ name:'sign_in' }">Sign in</router-link>

            <b-button disabled>or</b-button>

            <router-link class="btn btn-primary"
                         :to="{ name:'register' }">Register</router-link>
          </b-button-group>

        </b-jumbotron>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

</script>
