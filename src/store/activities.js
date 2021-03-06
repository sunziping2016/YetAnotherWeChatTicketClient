import {axios, throwOnError, objectToFormData} from './utils';
import Vue from 'vue';

const state = {
  activities: {}
};

const mutations = {
  updateActivity(state, activity) {
    ['beginTime', 'endTime', 'bookBeginTime', 'bookEndTime',
     'createdAt', 'updatedAt'].forEach(field => {
      if (typeof activity[field] === 'string')
        activity[field] = new Date(activity[field]);
    });
    const old = state.activities[activity._id];
    if (old && old.updatedAt.getTime() >= activity.updatedAt.getTime())
      return;
    Vue.set(state.activities, activity._id, activity);
  },
  deleteActivity(state, id) {
    Vue.delete(state.activities, id)
  }
};

const actions = {
  async create({commit}, activity) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    if (activity.mainImage || activity.titleImage) {
      ['beginTime', 'endTime', 'bookBeginTime', 'bookEndTime']
        .forEach(field => {
          if (activity[field])
            activity[field] = activity[field].toISOString();
        });
      headers['Content-Type'] = 'multipart/form-data';
      activity = objectToFormData(activity);
    }
    const data = await throwOnError(axios().post('/api/activity/', activity, {headers}));
    commit('updateActivity', data);
    return data;
  },
  async find({commit}, query) {
    const headers = query.published !== true ? {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    } : {};
    const data = await throwOnError(axios().get('/api/activity/', {
      params: query,
      headers
    }));
    for (let activity of data.results)
      commit('updateActivity', activity);
    return data;
  },
  async get({commit}, id) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    const data = await throwOnError(axios().get('/api/activity/' + id, {
      headers
    }));
    commit('updateActivity', data);
    return data;
  },
  async deleteActivity({commit}, id) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    };
    await throwOnError(axios().delete('/api/activity/' + id, {
      headers
    }));
    commit('deleteActivity', id);
  },
  async patch({commit}, activity) {
    const headers = {
      'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
    }, id = activity._id;
    delete activity._id;
    if (activity.mainImage || activity.titleImage) {
      ['beginTime', 'endTime', 'bookBeginTime', 'bookEndTime']
        .forEach(field => {
          if (activity[field])
            activity[field] = activity[field].toISOString();
        });
      headers['Content-Type'] = 'multipart/form-data';
      activity = objectToFormData(activity);
    }
    let data = await throwOnError(axios().patch('/api/activity/' + id, activity, {headers}));
    commit('updateActivity', data);
    return data;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

export const sioHandlers = {
  'activities:update': function (activity) {
    this.commit('activities/updateActivity', activity);
  },
  'activities:delete': function (id) {
    this.commit('activities/deleteActivity', id);
  }
};
