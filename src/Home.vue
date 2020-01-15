<template>
    <div>
        <nav class="uk-navbar uk-navbar-container uk-margin">
            <div class="uk-navbar-left">
                <a class="uk-navbar-toggle" uk-toggle="target: #offcanvas-push" href="#">
                    <span uk-navbar-toggle-icon></span> <span class="uk-margin-small-left">Menu</span>
                </a>
            </div>
        </nav>

        <div id="modal-user" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <h2 class="uk-modal-title">Status</h2>
                
                 <div class="uk-margin" v-if="user">
                    <select class="uk-select" v-model="user.presenceInfo.status">
                        <option value="online">Inlogstatus</option>
                        <option value="available">Beschikbaar</option>
                        <option value="unavailable">Niet beschikbaar</option>
                        <option value="dont_disturb">Niet storen</option>
                        <option value="at_appointment">Afspraak</option>
                        <option value="short_out_of_office">Kort afwezig</option>
                        <option value="long_out_of_office">Lang afwezig</option>
                    </select>
                </div>

                 <div class="uk-margin" v-if="user">
                    <input class="uk-input" type="text" v-model="user.presenceInfo.message" placeholder="Status">
                </div>

                <p class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                    <button class="uk-button uk-button-primary uk-modal-close" v-on:click="updateStatus" type="button">Update</button>
                </p>
            </div>
        </div>

        <div id="offcanvas-push" uk-offcanvas="mode: push; overlay: true">
            <div class="uk-offcanvas-bar">

                <div class="uk-card-header" uk-toggle="target: #modal-user" style="cursor:pointer">
                    <div class="uk-grid-small uk-flex-middle" uk-grid v-if="user">
                        <div class="uk-width-auto">
                            <div uk-tooltip="Beschikbaar" v-if="user.presenceInfo.status == 'available'" class="roundedIcon" style="background-color:green;"></div>
                            <div uk-tooltip="Niet beschikbaar" v-if="user.presenceInfo.status == 'unavailable'" class="roundedIcon" style="background-color:red;"></div>
                            <div uk-tooltip="Online" v-if="user.presenceInfo.status == 'online'" class="roundedIcon" style="background-color:green;"></div>
                            <div uk-tooltip="Niet storen" v-if="user.presenceInfo.status == 'dont_disturb'" class="roundedIcon" style="background-color:darkred;"></div>
                            <div uk-tooltip="Afspraak" v-if="user.presenceInfo.status == 'at_appointment'" class="roundedIcon" style="background-color:white;"></div>
                            <div uk-tooltip="Kort afwezig" v-if="user.presenceInfo.status == 'short_out_of_office'" class="roundedIcon" style="background-color:yellow;"></div>
                            <div uk-tooltip="Lang afwezig" v-if="user.presenceInfo.status == 'long_out_of_office'" class="roundedIcon" style="background-color:orange;"></div>
                        </div>
                        <div class="uk-width-expand">
                            <h3 class="uk-card-title uk-margin-remove-bottom">{{ user.person.commonName }}</h3>
                            <p class="uk-text-meta uk-margin-remove-top"><time datetime="2016-04-01T19:00">{{ user.presenceInfo.message }}</time></p>
                        </div>
                    </div>
                </div>

                <h3>Title</h3>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            </div>
        </div>

        <div class="uk-grid">
            <div class="uk-width-1-3">
                <div class="uk-card-header" v-for="(histor, i) in history" :key="'histor-' + i">
                    <div class="uk-grid-small uk-flex-middle" uk-grid>
                        <div class="uk-width-auto">
                            <img v-if="histor.attachment" class="uk-border-circle" width="40" height="40" :src="'data:image/jpeg;base64,' + histor.attachment.contentsB64String">
                            <img v-if="!histor.attachment" width="40" height="40" />
                        </div>
                        <div class="uk-width-expand">
                            <h3 class="uk-card-title uk-margin-remove-bottom">
                                <span v-if="histor.object.lastCommunication.status == 'Answer'"><i style="color:green;" class="fas fa-phone"></i></span>
                                <span v-if="histor.object.lastCommunication.status == 'Unavailable'"><i style="color:red;" class="fas fa-phone-slash"></i></span>
                                {{ histor.object.addressable.commonName }}
                                <span v-if="histor.object.lastCommunication.voicemail == true"><i style="color:#8383ff;" class="fas fa-voicemail"></i></span>
                            </h3>
                            <p class="uk-text-meta uk-margin-remove-top">
                                <time datetime="2016-04-01T19:00">
                                    {{ histor.object.lastCommunication.date }}<br />
                                    <span style="font-weight:bold;">Duur {{ NiceSeconds(histor.object.lastCommunication.durationSec) }}</span>
                                </time>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="uk-width-1-3">
                <div v-for="channel in channels" :key="channel.object.channelId">
                    {{ channel.object.phoneNumber }} is aan het bellen!
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UIkit from 'uikit'
import axios from 'axios'

export default {
    name: 'Home',

    data() {
        return {
            user: null,
            lines: [],
            channels: [],
            history: []
        }
    },

    methods: {
        NiceSeconds(sec) {

            if(sec < 60)
                return sec + 's'

            var min = sec / 60;
            min = Math.floor(min)

            var remeningSec = sec - (min * 60)

            return min + 'm' + remeningSec

        },
        updateStatus() {
            axios.put(this.$cookie.get("baseUrl") + '/me/message', JSON.stringify(this.user.presenceInfo.message)).catch(error => {
                console.log(error.response)
            })
            axios.put(this.$cookie.get("baseUrl") + '/me/status', this.user.presenceInfo.status)
        },
        refreshChannel() {
            var a = axios
            var base = this.$cookie.get("baseUrl")
            setInterval(function() { 
                a.get(base + '/channels').then(response => {
                    this.channels = []

                    this.channels = response.data.data

                    console.log(response.data.data)
                })
            }, 3000);
        }
    },

    mounted() {
        UIkit.notification('Succesvol ingelogd', {status: 'success'})

        axios.defaults.headers.common['Authorization'] = 'xelion ' + this.$cookie.get("authentication")
        
        axios.get(this.$cookie.get("baseUrl") + "/me/info").then(response => {
            this.user = response.data.object

            axios.get(this.$cookie.get("baseUrl") + "/communications/recent").then(response => {
                this.history = response.data.data

                for (let i = 0; i < this.history.length; i++) {
                    var icon = this.history[i].object.addressable.iconId

                    if(icon) {
                        axios.get(this.$cookie.get("baseUrl") + "/attachments/" + icon).then(response => {
                            this.history[i].attachment = response.data.object
                        })
                    }
                }
            })
        }).catch(error => {
            console.log(error.response)
        })
    }
}
</script>

<style scoped>
    .roundedIcon {
        width:30px;
        height:30px;
        border-radius: 50%;
    }
</style>