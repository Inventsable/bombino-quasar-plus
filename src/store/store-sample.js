import Vue from "vue";

const state = {
  settings: {
    exampleProperty: false
  },
  exampleBool: true,
  exampleArray: {
    key1: {
      foo: "bar"
    },
    key2: {
      lorem: "ipsum"
    }
  },
  search: ""
};

// Use mutations to directly interact with the state
const mutations = {
  setExampleProperty(state, value) {
    state.settings.example = value;
  },
  replaceEntireObjectContents(state, payload) {
    // Use Object.assign() instead of replacing individual values
    Object.assign(state.exampleArray[payload.id], payload.updates);
  },
  deleteArrayEntry(state, id) {
    // Must use Vue.delete instead of Array properties
    Vue.delete(state.exampleArray, id);
  },
  addArrayEntry(state, id, payload) {
    Vue.set(state.exampleArray, id, payload);
  }
};

// Don't update state in action directly, instead use an action to commit a mutation.
const actions = {
  // Action expects object with Vuex methods as first parameter
  // Payload is from component's mapAction parameter
  setExampleProperty({ commit }, value) {
    commit("setExampleProperty", value);
  }
};

const getters = {
  // Use getters to easily access your store data within Vue components.
  //
  settings: state => {
    // Always pass in state as first param
    return state.settings;
  },
  arrayExample: state => {
    return state.exampleArray;
  },
  arrayFiltered: (state, getters) => {
    let example = getters.arrayExample;
    let filtered = {};
    Object.keys(example).forEach(key => {
      // Assign contents to new variable
      let task = example[key];
      //
      // Do filtering logic
      //
      // Assign current key to above filtered object
      filtered[key] = task;
    });
    return filtered;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
