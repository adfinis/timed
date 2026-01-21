import Layout from "../components/layout.gts";

const greeting = "hello";

<template>
  <Layout>
    <:header>
      <h1>Welcome to ember!</h1>
    </:header>
    <:main>
      {{greeting}}, world!
    </:main>

  </Layout>
</template>
