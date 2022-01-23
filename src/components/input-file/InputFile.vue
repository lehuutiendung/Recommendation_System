<template>
    <div class="wrapper">
        <input id="file" type="file" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange" >
        <label for="file">Chọn hình ảnh</label>
    </div>
</template>
<script>
export default {
    name: 'InputFile',
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
  background: #f15d22;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: inherit;
  font-weight: 500;
  outline: none;
  padding: 1rem 50px;
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;
  width: 100%;
  text-align: center;
  &:hover {
    background-color: darken(#f15d22, 10%);
  }
}

.wrapper {
  background-color: #fff;
  border-radius: 1rem;
  width: 100%;
}
</style>