<template>
    <div class="wrapper">
        <input :id="indexFile" type="file" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange" :style="style">
        <label :for="indexFile" :style="style">{{label}}</label>
    </div>
</template>
<script>
export default {
    name: 'InputFile',
    props:{
      color: {
        type: String,
        default: "#f15d22"
      },
      textcolor:{
        type: String,
        default: "#fff"
      },
      hovercolor:{
        type: String,
        default: "#f04806"
      },
      padding: {
        type: String,
        default: "1rem 50px"
      },
      label:{
        type: String,
        default: "Chọn hình ảnh"
      },
      indexFile:{
        type: String,
        default: ""
      }
    },
    data() {
      return {
        style:{
          '--color': this.color,
          '--textcolor': this.textcolor,
          '--hovercolor': this.hovercolor,
          '--padding': this.padding,
        }
      }
    },
    methods: {
        /**
         * Render preview image
         */
        onFileChange(e) {
            let imageChoosed = e.target.files;
            let reader = new FileReader();
            reader.readAsDataURL(imageChoosed[0]);
            reader.onload = () => {
                let imgSrc = reader.result;
                this.$emit('getDataImage', imageChoosed[0], imgSrc);
            };
        },
    },
}
</script>
<style lang="scss" scoped>
[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}

[type="file"] + label {
  background: var(--color);
  border: none;
  border-radius: 5px;
  color: var(--textcolor);
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  font-weight: 450;
  outline: none;
  padding: var(--padding);
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;
  width: 100%;
  text-align: center;
  transition: opacity .25s ease-in-out;
  -moz-transition: opacity .25s ease-in-out;
  -webkit-transition: opacity .25s ease-in-out;
  &:hover {
    background-color: var(--hovercolor)!important;
  }
}

.wrapper {
  background-color: #fff;
  border-radius: 1rem;
  width: 100%;
}
</style>