// import { defineStore } from 'pinia';

// export const useErrorStore = defineStore('error', {
//   state: () => ({
//     has403Error: false
//   }),
//   actions: {
//     set403Error(value) {
//       this.has403Error = value;
//     }
//   }
// });

import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
  state: () => ({
    has403Error: false,
    last403Path: null,
    roleMismatch: false
  }),
  actions: {
    set403Error(status, path = null, roleMismatch = false) {
      this.has403Error = status;
      this.last403Path = path;
      this.roleMismatch = roleMismatch;
    },
    reset403Error() {
      this.has403Error = false;
      this.last403Path = null;
      this.roleMismatch = false;
    }
  }
});
