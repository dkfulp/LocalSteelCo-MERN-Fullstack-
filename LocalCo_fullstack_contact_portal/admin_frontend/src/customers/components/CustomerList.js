import React from 'react';

import CustomerItem from './CustomerItem';
import Card from '../../shared/components/UIElements/Card';
import './CustomerList.css';

const CustomerList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No customers found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="customers-list">
      {props.items.map(customer => (
        <CustomerItem
          key={customer.id}
          id={customer.id}
          name={customer.name}
          image="https://media.istockphoto.com/vectors/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-vector-id1130884625?k=20&m=1130884625&s=612x612&w=0&h=OITK5Otm_lRj7Cx8mBhm7NtLTEHvp6v3XnZFLZmuB9o="
          email={customer.email}
          phone={customer.phone}
          newsletter={customer.newsletter}
          questionCount={customer.questions.length}
        />
      ))}
    </ul>
  );
};

export default CustomerList;
