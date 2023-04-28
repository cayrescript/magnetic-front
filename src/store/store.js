import { createStore } from 'vuex';
import baseball from './modules/baseball';
import filters from './modules/filters';

export default createStore({
  modules: {
    baseball, 
    filters,
  },
});