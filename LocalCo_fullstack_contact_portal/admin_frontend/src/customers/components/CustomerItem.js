import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './CustomerItem.css';

const CustomerItem = props => {
  return (
    <li className="customer-item">
      <Card className="customer-item__content">
        <Link to={`/${props.id}/questions`}>
          <div className="customer-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="customer-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.questionCount} {props.questionCount === 1 ? 'Question' : 'Questions'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default CustomerItem;
