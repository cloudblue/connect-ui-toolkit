import ComplexTable from '~widgets/complexTable/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-complex-table', ComplexTable);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<ui-complex-table v-bind="args">
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>57</td>
      </tr>
      <tr>
        <td>Mary</td>
        <td>Stephen</td>
        <td>26</td>
      </tr>
    </ui-complex-table>`,
  }),

  args: {
    headers: [
      {
        name: 'name',
        width: '80px',
        text: 'Name',
        filterable: true,
      },
      {
        name: 'lastname',
        width: '80px',
        text: 'LastName',
        filterable: true,
      },
      {
        name: 'age',
        width: '40px',
        text: 'Age',
      },
    ],
    items: [
      {
        name: 'John',
        lastName: 'Doe',
        age: 33,
      },
      {
        name: 'Mary',
        lastName: 'Stephen',
        age: 26,
      },
    ],
    currentPage: 1,
    totalItems: 50,
  },
};

export default {
  title: 'Components/ComplexTable',
  component: ComplexTable,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    headers: {
      control: 'object',
    },
    fixed: 'boolean',
  },
};
