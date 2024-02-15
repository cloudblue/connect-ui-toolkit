import { mount } from '@vue/test-utils'
import ComplexTable from './widget';
import { nextTick } from 'vue'


describe('ComplexTable widget', () => {
  let result;


  describe('computed', () => {
    describe('#totalPages', () => {
      it('returns the total amount of pages', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: ['jj'],
          },
        })

        result = wrapper.vm.totalPages;

        expect(result).toEqual(4);
      });
    });

    describe('#previousButtonDisabled', () => {
      it('returns true if the current page is 1', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: ['jj'],
            currentPage: 1,
          },
        })

        result = wrapper.vm.previousButtonDisabled;

        expect(result).toEqual(true);
      });

      it('returns false if the current page is not 1', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: ['jj'],
            currentPage: 2,
          },
        })

        result = wrapper.vm.previousButtonDisabled;

        expect(result).toEqual(false);
      });
    });

    describe('#nextButtonDisabled', () => {
      it('returns true if the current page is the last one', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 25,
            items: ['hh'],
            headers: ['jj'],
            currentPage: 3,
          },
        })

        result = wrapper.vm.nextButtonDisabled;

        expect(result).toEqual(true);
      });

      it('returns false if the current page is not the last one', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: ['jj'],
            currentPage: 2,
          },
        })

        result = wrapper.vm.nextButtonDisabled;

        expect(result).toEqual(false);
      });
    });
  });

  describe('methods', () => {
    describe('#previousClicked', () => {
      it('emits previousClicked event', async () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: [],
            headers: ['jj'],
            currentPage: 2,
          },
        })

        result = wrapper.vm.previousClicked();

        expect(wrapper.emitted('previousClicked')).toBeTruthy()
      });
    });

    describe('#nextClicked', () => {
      it('emits nextClicked event', async () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: [],
            headers: ['jj'],
            currentPage: 2,
          },
        })

        result = wrapper.vm.nextClicked();

        expect(wrapper.emitted('nextClicked')).toBeTruthy()
      });
    });

    describe('#prepareItems', () => {
      it('returns the first 10 items', () => {
        const itemsList = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: itemsList,
            headers: ['jj'],
            currentPage: 2,
          },
        })

        result = wrapper.vm.prepareItems(itemsList);

        expect(result.length).toEqual(10);
      });
    });
  });

  describe('watch', () => {
    describe('props.items', () => {
      it('trigger the itemsLoaded event', async () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: [],
            headers: ['jj'],
          },
        })

        wrapper.setProps({
          items: ['other']
        });

        await nextTick()

        expect(wrapper.emitted().itemsLoaded).toBeTruthy();
      });
    });
  });
});
