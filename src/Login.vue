<template>
    <div>
        <Home v-if="$cookie.get('authentication')"></Home>
        <UIMainCard v-if="!$cookie.get('authentication')">
            <h3 class="uk-card-title uk-text-center">Xelion Applicatie</h3>
            <div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: user"></span>
                        <input class="uk-input uk-form-large" type="text" name="xelion-name" autocomplete="xelion-name" v-model="name">
                    </div>
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input uk-form-large" name="xelion-pass" autocomplete="xelion-pass" type="password" v-model="password">	
                    </div>
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: home"></span>
                        <input class="uk-input uk-form-large" name="xelion-host" type="text" autocomplete="xelion-host" v-model="host">
                    </div>
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: database"></span>
                        <input class="uk-input uk-form-large" name="xelion-tenant" type="text" autocomplete="xelion-tenant" v-model="tenant">
                    </div>
                </div>
                <div class="uk-margin">
                    <button @click="login" class="uk-button uk-button-primary uk-button-large uk-width-1-1">Login</button>
                </div>
            </div>
        </UIMainCard>
    </div>
</template>

<script>
import UIMainCard from './components/UI/MainCard'
import Home from './Home.vue'
import UIkit from 'uikit'
import axios from 'axios'

export default {
    name: 'Login',
    data() {
        return {
            host: null,
            tenant: null,
            name: null,
            password: null,
            error: false,
            api: 'v1'
        }
    },
    methods: {
        login() {
            this.$cookie.set("tenant", this.tenant, 100)
            this.$cookie.set("name", this.name, 100)
            this.$cookie.set("host", this.host, 100)
            this.$cookie.set("password", this.password, 100)

            axios.post('https://'+this.host+'/api/'+this.api+'/'+this.tenant+'/me/login', { userName: this.name, password: this.password, userSpace: 'app-' + this.name}).then(response => {
                this.$cookie.set("authentication", response.data.authentication, 1)
                this.$cookie.set("renewalToken", response.data.renewalToken, 1)
                this.$cookie.set("validUntil", response.data.validUntil, 1)
                this.$cookie.set("version", response.data.version, 1)
                this.$cookie.set("serverVersion", response.data.serverVersion, 1)
                this.$cookie.set("buildNumber", response.data.buildNumber, 1)

                this.$cookie.set("baseUrl", 'https://'+this.host+'/api/'+this.api+'/'+this.tenant, 1)

                this.$forceUpdate();
            }).catch(error => {
                if(error.response.data.errorCode == 10100)
                {
                    UIkit.notification(error.response.data.errorCode + ': De gegevens kloppen niet!', {status: 'danger'})
                } else {
                    UIkit.notification(error.response.data.errorCode + ': ' + error.response.data.message, {status: 'danger'})
                }
            })

            return 'Er is iets misgegaan!';
        },
    },
    mounted() {
        this.name = this.$cookie.get('name')
        this.password = this.$cookie.get('password')
        this.host = this.$cookie.get('host')
        this.tenant = this.$cookie.get('tenant')
    },
    components: {
        UIMainCard, Home
    }
}
</script>

<style>
    .uk-notification-message {
        width:900px;
        left:-230px;
    }

    .bg {
        background: linear-gradient(87deg,#11cdef 0,#1171ef 100%)!important;
    }

    .card {
        border: .0625rem solid rgba(0,0,0,.05);
        border-radius: .25rem;
    }
</style>