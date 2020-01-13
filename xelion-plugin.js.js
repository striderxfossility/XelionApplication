const XelionPlugin = {
    install(Vue, options) {
        Vue.mixin({
            mounted() {
            console.log('Mounted!');
            }
      });
    }
  };
  
  export default MyPlugin;