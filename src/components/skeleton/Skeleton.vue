<template>
  <ul class="wrap-skeleton">
    <li class="blog-post o-media">
      <div class="o-media__figure">
        <span
          class="skeleton-box"
          style="width: 70px; height: 70px; border-radius: 50%"
        ></span>
      </div>
      <div class="o-media__body">
        <div class="o-vertical-spacing">
          <h3 class="blog-post__headline">
            <span class="skeleton-box" style="width: 55%"></span>
          </h3>
          <p>
            <span class="skeleton-box" style="width: 80%"></span>
            <span class="skeleton-box" style="width: 90%"></span>
            <span class="skeleton-box" style="width: 83%"></span>
            <span class="skeleton-box" style="width: 80%"></span>
          </p>
          <div class="blog-post__meta">
            <span class="skeleton-box" style="width: 70px"></span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.wrap-skeleton{
    position: relative;
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 14px;
    border: 1px solid #eeeeee;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
}
.skeleton-box {
  display: flex;
  height: 1em;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #DDDBDD;
  margin: 2px 0;
  border-radius: 8px;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.blog-post {
  &__headline {
    font-size: 1.15em;
    font-weight: bold;
  }

  &__meta {
    font-size: 0.95em;
    color: #6b6b6b;
  }
}

// OBJECTS

.o-media {
  display: flex;
  
  &__body {
    flex-grow: 1;
    margin-left: 1em;
  }
}

.o-vertical-spacing {
  > * + * {
    margin-top: 0.75em;
  }
  
  &--l {
    > * + * {
      margin-top: 2em;
    }
  }
}

// MISC

* {
  box-sizing: border-box;
}

body {
  max-width: 42em;
  margin: 0 auto;
  padding: 3em 1em;
  font-family: 'Karla', sans-serif;
  line-height: 1.4;
}

header {
  max-width: 42em;
  margin: 0 auto;
  text-align: center;
  font-size: 1.2em;
}

main {
  margin-top: 3em;
}

header {
  h1 {
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    line-height: 1.2;
    font-size: 2em;
  }

  p {
    &:not(:first-child) {
      margin-top: 1em;
    }
  }
}
</style>