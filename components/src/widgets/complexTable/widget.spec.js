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

    describe('#filterableHeaders', () => {
      it('returns the subarray of filterable headers', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: [
              {value: 'name', text: 'Name', filterable: true},
              {value: 'lastName', text: 'Lastname', filterable: true},
              {value: 'age', text: 'Age'},
            ],
          },
        })

        result = wrapper.vm.filterableHeaders;

        expect(result).toEqual([{"filterable": true, "text": "Name", "value": "name"}, {"filterable": true, "text": "Lastname", "value": "lastName"}]);
      });
    });

    describe('#cleanFiltersApplied', () => {
      it('returns a list of filters applied with value', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: [
              {value: 'name', text: 'Name', filterable: true},
              {value: 'lastName', text: 'Lastname', filterable: true},
              {value: 'age', text: 'Age'},
            ],
          },
        })

        wrapper.get('ui-button').trigger('click')
        const filterableItems = wrapper.findAll('.filter-item ui-textfield')
        filterableItems[0].trigger('input', { detail: ['my name'] })

        result = wrapper.vm.cleanFiltersApplied;

        expect(result).toEqual({ name: 'my name' });
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

    describe('#applyFilters', () => {
      it('emits filtersApplied event', () => {
        const wrapper = mount(ComplexTable, {
          propsData: {
            totalItems: 35,
            items: ['hh'],
            headers: [
              {value: 'name', text: 'Name', filterable: true},
              {value: 'lastName', text: 'Lastname', filterable: true},
              {value: 'age', text: 'Age'},
            ],
          },
        })

        wrapper.get('ui-button').trigger('click')
        const filterableItems = wrapper.findAll('.filter-item ui-textfield')
        filterableItems[0].trigger('input', { detail: ['my name'] })

        result = wrapper.vm.applyFilters();

        expect(wrapper.emitted('filtersApplied')).toEqual([[
          {
            name: 'my name',
          }
        ]])
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
