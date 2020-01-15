<template>
    <div style="margin-top:30px; position:relative" v-if="info">
        <h3>
            <i v-if="info.objectType == 'Person'" class="fas fa-user"></i>
            <i v-if="info.objectType == 'Organisation'" class="fas fa-building"></i>
            <i v-if="info.objectType == 'UnknownAddressable'" class="far fa-question-circle"></i>
            {{ info.commonName }} 

            <span class="uk-text-meta" v-if="info.telecomAddresses">{{ info.telecomAddresses[0].address }}</span>
        </h3>

        <a :href="'https://api.whatsapp.com/send?phone=' + whap()" target="_blank" class="whap" v-if="whap() != false">
            <i class="fab fa-whatsapp"></i>
            whatsapp
        </a>

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

    methods: {
        whap() {
            if(this.info.commonName.includes("+316"))
                return this.info.commonName;

            if(this.info.telecomAddresses)
            {
                if(this.info.telecomAddresses[0].address.includes("+316"))
                    return this.info.telecomAddresses[0].address
            }

            return false
        }
    },

    watch: {
        oid() {
            axios.get(this.$cookie.get("baseUrl") + "/addressables/" + this.oid).then(response => {
                this.info = response.data.object
            })

            axios.get(this.$cookie.get("baseUrl") + "/addressables/" + this.oid + "/contacts").then(response => {
                console.log(response)
            })
        }
    },

    mounted() {
        axios.get(this.$cookie.get("baseUrl") + "/addressables/" + this.oid).then(response => {
            this.info = response.data.object
        })

        axios.get(this.$cookie.get("baseUrl") + "/addressables/" + this.oid + "/contacts").then(response => {
            console.log(response)
        })
    },
}
</script>

<style scoped>
    .whap {
        position: absolute;
        right: 50px;
        top: -3px;
        font-weight: bold;
        font-size: 30px;
        color: green;
        cursor:pointer;
    }
</style>