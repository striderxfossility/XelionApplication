<template>
    <div style="margin-top:30px;" v-if="info">
        <h3>
            <i v-if="info.objectType == 'Person'" class="fas fa-user"></i>
            <i v-if="info.objectType == 'Organisation'" class="fas fa-building"></i>
            <i v-if="info.objectType == 'UnknownAddressable'" class="far fa-question-circle"></i>
            {{ info.commonName }} 

            <span class="uk-text-meta" v-if="info.telecomAddresses">{{ info.telecomAddresses[0].address }}</span>
        </h3>

        <div v-if="info.employments">
            <div v-if="info.employments.length > 0">
                Werkt bij <i class="fas fa-building"></i> {{ info.employments[0].commonName }} 
                <span v-if="info.employments[0].telecomAddresses">
                    <span class="uk-text-meta" v-if="info.employments[0].telecomAddresses.length > 0">{{ info.employments[0].telecomAddresses[0].address }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "Contact",
    props: ['oid'],

    data() {
        return {
            info: null
        }
    },

    watch: {
        oid() {
            axios.get(this.$cookie.get("baseUrl") + "/addressables/" + this.oid).then(response => {
                this.info = response.data.object
            })
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>