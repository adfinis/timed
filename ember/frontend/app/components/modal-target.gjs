const TARGET_ID = "modals";

const ModalTarget = <template>
  <div id={{TARGET_ID}} class="[&>*]:overflow-x-hidden" />
</template>;

export default ModalTarget;
export { TARGET_ID };
