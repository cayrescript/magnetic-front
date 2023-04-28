import BaseballApi from '../../api';
import { prepareData } from '../../api/utils/dataformat';

const apiService = new BaseballApi();

const state = {
  hitsSingleSeason: [],
  error: null
}

const getters = {
  getHitsSingleSeason: (state) => state.hitsSingleSeason,
  getError: (state) => state.error
}

const actions = {
  async fetchHitsSingleSeason({ commit }) {
    const data = await apiService.fetchHitsSingleSeason();
    let formatedData = prepareData(data);
    commit('SET_HITS_SINGLE_SEASON', formatedData);
  },
}

const mutations = {
  SET_HITS_SINGLE_SEASON: (state, data) => {
    state.hitsSingleSeason = data
  },
  setError: (state, error) => {
    state.error = error
  }
}

export default {
  name: 'baseball',
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
