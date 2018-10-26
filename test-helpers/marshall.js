
// fully populated:
// { nonNullTypeList: false, listType: false, nonNullTypeField: false, typeof: null };
const obj = {
  Business: {},
  Catgeory: {},
  ClientUser: {
    user: { nonNullTypeField: true, typeof: 'User' },
    client: { nonNullTypeField: true, typeof: 'Client' },
  },
  InfoboxType: {
    infoboxes: { listType: true, nonNullTypeField: true, typeof: 'Infobox' },
  },
};

query = {
  email: 1,
  clientUsers: 1
};