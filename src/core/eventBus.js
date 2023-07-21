import mitt from 'mitt';


const bus = mitt();

export const busMixin = {
  computed: {
    $bus() {
      return bus;
    },
  },
};

export default bus;
