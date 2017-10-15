import {axios, throwOnError, socket} from './utils';
import Vue from 'vue';

const state = {
  tickets: {},
  ticketsByActivity: {}
};

const mutations = {
  updateTicket(state, ticket) {
    ['createdAt', 'updatedAt'].forEach(field => {
      if (typeof ticket[field] === 'string')
        ticket[field] = new Date(ticket[field]);
    });
    const old = state.tickets[ticket._id];
    if (old && old.updatedAt.getTime() >= ticket.updatedAt.getTime())
      return;
    Vue.set(state.tickets, ticket._id, ticket);
    Vue.set(state.ticketsByActivity, ticket.activity, ticket);
  },
  deleteTicket(state, id) {
    const old = state.tickets[id];
    if (old && old)
      Vue.delete(state.ticketsByActivity, old.activity);
    Vue.delete(state.tickets, id)
  }
};

const actions = {
  async create({commit}, ticket) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    const data = await throwOnError(axios().post('/api/ticket/', ticket, {
      headers
    })).catch(err => {
      if (err.data) {
        if (!err.data.deleted)
          commit('updateTicket', err.data.data);
        else
          commit('deleteTicket', err.data.data);
      }
      throw err;
    });
    commit('updateTicket', data);
    return data;
  },
  async get({commit}, id) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    const data = await throwOnError(axios().get('/api/ticket/' + id, {
      headers
    }));
    commit('updateTicket', data);
    return data;
  },
  async find({commit}, query) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    const data = await throwOnError(axios().get('/api/ticket/', {
      params: query,
      headers
    }));
    for (let ticket of data.results)
      commit('updateTicket', ticket);
    return data;
  },
  async deleteTicket({commit}, id) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    await throwOnError(axios().delete('/api/ticket/' + id, {
      headers
    }));
    commit('deleteTicket', id);
  },
  async getTicketToken(_, id) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    return await throwOnError(axios().get('/api/check-ticket/', {
      params: {id},
      headers
    }));
  },
  async checkTicketToken(_, token) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    return await throwOnError(axios().post('/api/check-ticket/', {token}, {
      headers
    }));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

export const sioHandlers = {
  'tickets:update': function (ticket) {
    this.commit('tickets/updateTicket', ticket);
  },
  'tickets:delete': function (id) {
    this.commit('tickets/deleteTicket', id);
  }
};
