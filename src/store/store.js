import { createStore } from 'vuex';
import baseball from './modules/baseball';

export default createStore({
  modules: {
    baseball, 
  },
});