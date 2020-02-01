<template>
    <div>
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: "Welcome! Vue!"
        };
    }
};
</script>

<style scoped>
h1 {
    color: red;
}
</style>
