import Tabs from './widget.vue';

describe('Tabs', () => {
  describe('defaults', () => {
    it('should inject proper tools', () => {
      expect(Tabs.inject).toEqual(['$listen', '$publish']);
    });

    it('should register publishing', () => {
      expect(Tabs.$publishes).toEqual(['open-pad']);
    });
  });
});