// Libs
import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// Component
import Dashboard from '../dashboard/Dashboard';

// Mocks
const mockInvoices = [
  {
    _id: '1',
    grandTotal: 1000,
    recipient: { fullname: 'Alice' }
  },
  {
    _id: '2',
    grandTotal: 2000,
    recipient: { fullname: 'Bob' }
  },
  {
    _id: '3',
    grandTotal: 500,
    recipient: { fullname: 'Alice' }
  },
  {
    _id: '4',
    grandTotal: 1500,
    recipient: { fullname: 'Charlie' }
  }
];

describe('Dashboard Component', () => {
  it('renders without crashing and handles invoices prop', () => {
    const wrapper = shallow(<Dashboard invoices={mockInvoices} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the correct number of cards (3 summary cards)', () => {
    const wrapper = shallow(<Dashboard invoices={mockInvoices} />);
    expect(wrapper.find('.bg-white.rounded-xl.shadow.p-6')).toHaveLength(6); // 3 summary + 3 chart cards
  });

  it('renders Top clients and Monthly revenue sections', () => {
    const wrapper = shallow(<Dashboard invoices={mockInvoices} />);
    expect(wrapper.findWhere(node => node.text().includes('Top clients par revenu')).exists()).toBe(true);
    expect(wrapper.findWhere(node => node.text().includes('Revenu par mois')).exists()).toBe(true);
  });

  it('renders correct number of top clients', () => {
    const wrapper = mount(<Dashboard invoices={mockInvoices} />);
    // Alice, Bob, Charlie
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
    expect(wrapper.text()).toContain('Charlie');
  });

  it('renders correct total and total amount', () => {
    const wrapper = mount(<Dashboard invoices={mockInvoices} />);
    expect(wrapper.text()).toContain('4'); // total invoices
    expect(wrapper.text()).toContain('5000.000 DT'); // total amount
  });

  it('renders correctly when invoices prop is not an array', () => {
    const wrapper = shallow(<Dashboard invoices={null} />);
    expect(wrapper.text()).toContain('Les données des factures ne sont pas disponibles');
  });

  it('matches snapshot', () => {
    const tree = renderer.create(<Dashboard invoices={mockInvoices} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
