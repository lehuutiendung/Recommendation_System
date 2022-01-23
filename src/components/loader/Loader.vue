<template>
    <div class="wrap-loader">
        <div class="loader">
            <div class="loaderBar"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Loader',
}
</script>
<style scoped>
.wrap-loader{
    position: absolute;
    bottom: 0;
}
.loader { 
    width:610px; 
    margin:0 auto;
    border-radius:10px;
    border:4px solid transparent;
    position:relative;
    padding:2px;
}
.loader:before {
    content:'';
    border-radius:10px;
    position:absolute;
    top:-4px; 
    right:-4px; 
    bottom:-4px; 
    left:-4px;
}
.loader .loaderBar { 
    position:absolute;
    border-radius:10px;
    top:0;
    right:100%;
    bottom:0;
    left:0;
    background:rgb(60, 116, 236); 
    width:0;
    animation:borealisBar 2s linear infinite;
}

@keyframes borealisBar {
  0% {
    left:0%;
    right:100%;
    width:0%;
  }
  10% {
    left:0%;
    right:75%;
    width:25%;
  }
  90% {
    right:0%;
    left:75%;
    width:25%;
  }
  100% {
    left:100%;
    right:0%;
    width:0%;
  }
}    
</style>