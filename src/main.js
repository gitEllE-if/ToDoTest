// Описание задачи:
// Исправить и дополнить приложение Список задач,
// в функционал которого входит:
// 1) Добавление новых задач;
// 2) Отображение списка задач;
// 3) Фильтрация задач по статусу;
// 4) Удаление элементов из списка задач;
// 5) Получение задач из удалённого хранилища при инициализации приложения
// (https://my-json-server.typicode.com/falk20/demo/todos);

// От вас требуется:
// 1. Доработать приложение в соответствии с заявленным функционалом.
// 2. Описать ваши изменения в коде комментариями.
// Изменять код можно как душа пожелает.

import vue from "vue";
import todoList from "./todoListComponent";
import "../style.css";

window.app = new vue({
  el: "#app",

  data() {
    return {
      //выбраны другие имена переменных и структура данных
      //'innerData', 'zadachi' - плохой нейминг
      todoes: [],
      activeFilter: "all",
      filters: {
        all: {
          textRu: "все",
          cb: () => true
        },
        active: {
          textRu: "активные",
          cb: (item) => item.active === true
        },
        completed: {
          textRu: "завершенные",
          cb: (item) => item.active === false
        }
      },
      newTodoTxt: ""
    };
  },
  components: { todoList },
  //запросы к API можно реализовать в хуке created,
  //доступ к DOM реализуем в хуке mounted
  async created() {
    //- применени синтаксис async await, как более читабельный;
    //- запрос к API - потенциально опасный код,
    //  требуется обработка ошибок, применен блок try catch
    try {
      let res = await fetch(
        "https://my-json-server.typicode.com/falk20/demo/todos"
      );
      res = await res.json();
      this.todoes = res || [];
    } catch (err) {
      console.warn("FAIL - get todoes: " + err);
    }
  },
  mounted() {
    //доступ к элементу лучше через ref, чем getElementById
    const input = this.$refs.input;
    if (input) {
      // input.focus();
    }
  },

  //- для фильтра по смыслу больше подходит группа input type=radio;
  //- список задач вынесен в отдельный компонент,
  //  (что делает код более структурированным, читабельным и т.п.);
  //- для отображения списка задач применяется один и тот же компонент,
  //  принимающий разные props, в зависимости от значеня фильтра,
  //  (что позволяет избавиться от дублирования кода)
  template: `
    <div class="todo">
      <form class="todo__form">
        <div class="todo-add">
          <input v-model="newTodoTxt"
            placeholder="новая задача"
            ref="input"
            class="todo-add__input"
            required
          />
          <button @click.prevent="addTodo" class="todo-add__btn">
            Добавить задачу
          </button>
        </div>
        
        <div class="todo-filter">
          <div class="todo-filter-items" v-for="item in Object.keys(filters)">
            <input type=radio
              class="todo-filter__radio"
              :value="item"
              v-model="activeFilter"
              name="filter"
              :id="item"
            />
            <label :for="item" class="todo-filter__label">  
              {{filters[item].textRu}}
            </label>
          </div>
        </div>
      </form>

      <todoList
        :list="todoes.filter(filters[activeFilter].cb)"
        @remove="removeTodo"
        @change="changeTodo"
      >
      </todoList>
    </div>
  `,

  methods: {
    //методы добавления/удаления/изменения задачи полностью переписаны
    addTodo() {
      if (!this.newTodoTxt) {
        return;
      }
      const newTodo = {
        id: this.todoes.length ? this.todoes[this.todoes.length - 1].id + 1 : 1,
        text: this.newTodoTxt,
        active: true
      };
      this.todoes.push(newTodo);
    },
    removeTodo(itemId) {
      const idx = this.todoes.findIndex((el) => el.id === itemId);
      if (idx !== -1) {
        this.todoes.splice(idx, 1);
      }
    },
    changeTodo(itemId) {
      const idx = this.todoes.findIndex((el) => el.id === itemId);
      if (idx !== -1) {
        this.todoes[idx].active = !this.todoes[idx].active;
      }
    }

    //setFilter(filter) -  не нужен,
    //реализовано с помощью input type=radio и реактивность
  }
});
