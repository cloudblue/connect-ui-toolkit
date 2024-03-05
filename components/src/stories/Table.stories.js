import Table from '~widgets/table/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-table', Table);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<ui-table v-bind="args">
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
    </ui-table>`,
  }),

  args: {
    headers: [
      {
        name: 'name',
        width: '80px',
        text: 'Name',
      },
      {
        name: 'lastname',
        width: '80px',
        text: 'LastName',
      },
      {
        name: 'age',
        width: '40px',
        text: 'Age',
      },
    ],
  },
};

export default {
  title: 'Components/Table',
  component: Table,
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
