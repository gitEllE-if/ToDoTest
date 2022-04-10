const todoList = {
  props: ["list"],
  template: `
    <main class="todo-list" >
      <section v-for="item in list"
        :key = "item.id"
        :class="[item.active ? 'isActive' : '', 'todo-list-item']"
      >
        {{ item.text }}
        <div class='todo-list-item__btns'>
          <div class="todo-list-item__btn" @click='e => $emit("change", item.id)'>
            &#10003;
          </div>
          <div class="todo-list-item__btn" @click='e => $emit("remove", item.id)'>
            &#10007;
          </div>
        </div>
      </section>
      <section v-if="!list.length">
        список пуск
      </section>
    </main>
    `
};
export default todoList;
